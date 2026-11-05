
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        return ResponseEntity.ok(bookService.getBookById(bookId));
    }

    // Get book by ISBN
    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<BookDTO> getBookByISBN(
            @PathVariable String isbn
    ) throws BookException {

        return ResponseEntity.ok(bookService.getBookByISBN(isbn));
    }

    // Get all books
    @GetMapping
    public ResponseEntity<List<BookDTO>> getAllBooks() {

        return ResponseEntity.ok(bookService.getAllBooks());
    }

    // Search books with filters and pagination
    @PostMapping("/search")
    public ResponseEntity<PageResponse<BookDTO>> searchBooks(
            @RequestBody BookSearchRequest request
    ) {

        return ResponseEntity.ok(
                bookService.searchBookWithFilters(request)
        );
    }

    // Get total active books
    @GetMapping("/stats/active")
    public ResponseEntity<Long> getTotalActiveBooks() {

        return ResponseEntity.ok(bookService.getTotalActiveBooks());
    }

    // Get total available books
    @GetMapping("/stats/available")
    public ResponseEntity<BookStatsResponse> getTotalAvailableBooks() {
        long totalActiveBooks = bookService.getTotalActiveBooks();
        long totalAvailableBooks = bookService.getTotalAvailableBooks();
        return ResponseEntity.ok(
                new BookStatsResponse(totalActiveBooks, totalAvailableBooks)
        );
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
