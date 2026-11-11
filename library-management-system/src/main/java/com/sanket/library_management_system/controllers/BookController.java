
package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.BookException;
import com.sanket.library_management_system.exception.GenreException;
import com.sanket.library_management_system.payload.dto.BookDTO;
import com.sanket.library_management_system.payload.request.BookSearchRequest;
import com.sanket.library_management_system.payload.response.ApiResponse;
import com.sanket.library_management_system.payload.response.PageResponse;
import com.sanket.library_management_system.services.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    // Get book by ID
    @GetMapping("/{bookId}")
    public ResponseEntity<BookDTO> getBookById(
            @PathVariable Long bookId
    ) throws BookException {
        try {
            log.info("Fetching book with id: {}", bookId);
            BookDTO book = bookService.getBookById(bookId);
            log.info("Book fetched successfully: {} (ISBN: {})", book.getTitle(), book.getIsbn());
            return ResponseEntity.ok(book);
        } catch (BookException e) {
            log.error("Failed to fetch book with id: {}, Error: {}", bookId, e.getMessage());
            throw e;
        }
    }

    // Get book by ISBN
    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<BookDTO> getBookByISBN(
            @PathVariable String isbn
    ) throws BookException {
        try {
            log.info("Fetching book with ISBN: {}", isbn);
            BookDTO book = bookService.getBookByISBN(isbn);
            log.info("Book fetched successfully: {}", book.getTitle());
            return ResponseEntity.ok(book);
        } catch (BookException e) {
            log.error("Failed to fetch book with ISBN: {}, Error: {}", isbn, e.getMessage());
            throw e;
        }
    }

    // Get all books
    @GetMapping
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        try {
            log.info("Fetching all books");
            List<BookDTO> books = bookService.getAllBooks();
            log.info("Successfully fetched {} books", books.size());
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            log.error("Failed to fetch all books, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Search books with filters and pagination
    @PostMapping("/search")
    public ResponseEntity<PageResponse<BookDTO>> searchBooks(
            @RequestBody BookSearchRequest request
    ) {
        try {
            log.info("Searching books with filters: title={}, author={}, genre={}, page={}, size={}", 
                    request.getTitle(), request.getAuthor(), request.getGenreId(), request.getPage(), request.getSize());
            PageResponse<BookDTO> result = bookService.searchBookWithFilters(request);
            log.info("Book search completed, found {} records", result.getTotalElements());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Book search failed, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Get total active books
    @GetMapping("/stats/active")
    public ResponseEntity<Long> getTotalActiveBooks() {
        try {
            log.info("Fetching total active books count");
            Long count = bookService.getTotalActiveBooks();
            log.info("Total active books: {}", count);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("Failed to fetch active books count, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Get total available books
    @GetMapping("/stats/available")
    public ResponseEntity<BookStatsResponse> getTotalAvailableBooks() {
        try {
            log.info("Fetching book statistics (active and available)");
            long totalActiveBooks = bookService.getTotalActiveBooks();
            long totalAvailableBooks = bookService.getTotalAvailableBooks();
            log.info("Book stats - Active: {}, Available: {}", totalActiveBooks, totalAvailableBooks);
            return ResponseEntity.ok(
                    new BookStatsResponse(totalActiveBooks, totalAvailableBooks)
            );
        } catch (Exception e) {
            log.error("Failed to fetch book statistics, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    public static class BookStatsResponse{
        public long totalActiveBooks;
        public long totalAvailableBooks;

        public BookStatsResponse(long totalActiveBooks, long totalAvailableBooks){
            this.totalAvailableBooks = totalAvailableBooks;
            this.totalActiveBooks = totalActiveBooks;
        }
    }
}
