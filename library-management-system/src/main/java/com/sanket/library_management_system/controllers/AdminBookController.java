package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.BookException;
import com.sanket.library_management_system.exception.GenreException;
import com.sanket.library_management_system.payload.dto.BookDTO;
import com.sanket.library_management_system.payload.response.ApiResponse;
import com.sanket.library_management_system.services.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/book")
@RequiredArgsConstructor
public class AdminBookController {

    @Autowired
    private final BookService bookService;

    // Create a new book
    @PostMapping
    public ResponseEntity<BookDTO> createBook(
            @Valid @RequestBody BookDTO bookDTO
    ) throws GenreException, BookException {
        try {
            log.info("Creating new book: title={}, isbn={}, author={}", 
                    bookDTO.getTitle(), bookDTO.getIsbn(), bookDTO.getAuthor());
            BookDTO created = bookService.createBook(bookDTO);
            log.info("Book created successfully with id: {}", created.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            log.error("Failed to create book, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    // Update book
    @PutMapping("/{bookId}")
    public ResponseEntity<BookDTO> updateBook(
            @PathVariable Long bookId,
            @Valid @RequestBody BookDTO bookDTO
    ) throws BookException, GenreException {
        try {
            log.info("Updating book with id: {}", bookId);
            BookDTO updated = bookService.updateBook(bookId, bookDTO);
            log.info("Book updated successfully: {}", bookId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Failed to update book with id: {}, Error: {}", bookId, e.getMessage(), e);
            throw e;
        }
    }

    // Soft delete book
    @DeleteMapping("/{bookId}")
    public ResponseEntity<ApiResponse> deleteBook(
            @PathVariable Long bookId
    ) throws BookException {
        try {
            log.info("Soft deleting book with id: {}", bookId);
            bookService.deleteBook(bookId);
            log.info("Book soft deleted successfully: {}", bookId);
            return ResponseEntity.ok(new ApiResponse("Book deleted successfully!", true));
        } catch (BookException e) {
            log.error("Failed to soft delete book with id: {}, Error: {}", bookId, e.getMessage());
            throw e;
        }
    }

    // Permanently delete book
    @DeleteMapping("/{bookId}/permanent")
    public ResponseEntity<ApiResponse> hardDeleteBook(
            @PathVariable Long bookId
    ) {
        try {
            log.info("Hard deleting book with id: {}", bookId);
            bookService.hardDeleteBook(bookId);
            log.info("Book hard deleted permanently: {}", bookId);
            return ResponseEntity.ok(new ApiResponse("Book deleted permanently!", true));
        } catch (Exception e) {
            log.error("Failed to hard delete book with id: {}, Error: {}", bookId, e.getMessage(), e);
            throw e;
        }
    }

    // Bulk create books
    @PostMapping("/bulk")
    public ResponseEntity<List<BookDTO>> createBookBulk(
            @Valid @RequestBody List<@Valid BookDTO> bookDTOs
    ) throws GenreException, BookException {
        try {
            log.info("Bulk creating {} books", bookDTOs.size());
            List<BookDTO> created = bookService.createBookBulk(bookDTOs);
            log.info("Successfully created {} books in bulk", created.size());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            log.error("Failed to bulk create books, Error: {}", e.getMessage(), e);
            throw e;
        }
    }
}
