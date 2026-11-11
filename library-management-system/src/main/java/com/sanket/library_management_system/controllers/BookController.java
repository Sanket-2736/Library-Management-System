
package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.BookException;
import com.sanket.library_management_system.payload.dto.BookDTO;
import com.sanket.library_management_system.payload.request.BookSearchRequest;
import com.sanket.library_management_system.payload.response.PageResponse;
import com.sanket.library_management_system.services.BookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Slf4j
public class BookController {

    private final BookService bookService;

    @GetMapping("/{bookId}")
    public ResponseEntity<BookDTO> getBookById(
            @PathVariable Long bookId
    ) throws BookException {

        log.info("Received request to fetch book with ID: {}", bookId);

        BookDTO book = bookService.getBookById(bookId);

        log.info("Successfully fetched book with ID: {}", bookId);

        return ResponseEntity.ok(book);
    }

    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<BookDTO> getBookByISBN(
            @PathVariable String isbn
    ) throws BookException {

        log.info("Received request to fetch book with ISBN: {}", isbn);

        BookDTO book = bookService.getBookByISBN(isbn);

        log.info("Successfully fetched book with ISBN: {}", isbn);

        return ResponseEntity.ok(book);
    }

    @GetMapping
    public ResponseEntity<List<BookDTO>> getAllBooks() {

        log.info("Received request to fetch all books");

        List<BookDTO> books = bookService.getAllBooks();

        log.info("Successfully fetched {} books", books.size());

        return ResponseEntity.ok(books);
    }

    @PostMapping("/search")
    public ResponseEntity<PageResponse<BookDTO>> searchBooks(
            @RequestBody BookSearchRequest request
    ) {

        log.info("Received request to search books with filters");

        PageResponse<BookDTO> response =
                bookService.searchBookWithFilters(request);

        log.info("Book search completed successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/active")
    public ResponseEntity<Long> getTotalActiveBooks() {

        log.info("Received request to fetch total active books count");

        Long totalActiveBooks = bookService.getTotalActiveBooks();

        log.info("Total active books: {}", totalActiveBooks);

        return ResponseEntity.ok(totalActiveBooks);
    }

    @GetMapping("/stats/available")
    public ResponseEntity<BookStatsResponse> getTotalAvailableBooks() {

        log.info("Received request to fetch book availability statistics");

        long totalActiveBooks = bookService.getTotalActiveBooks();
        long totalAvailableBooks = bookService.getTotalAvailableBooks();

        log.info("Book statistics retrieved. Active books: {}, Available books: {}",
                totalActiveBooks, totalAvailableBooks);

        return ResponseEntity.ok(
                new BookStatsResponse(totalActiveBooks, totalAvailableBooks)
        );
    }

    public static class BookStatsResponse {
        public long totalActiveBooks;
        public long totalAvailableBooks;

        public BookStatsResponse(long totalActiveBooks, long totalAvailableBooks) {
            this.totalAvailableBooks = totalAvailableBooks;
            this.totalActiveBooks = totalActiveBooks;
        }
    }
}
