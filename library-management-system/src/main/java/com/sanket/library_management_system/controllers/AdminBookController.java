
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

@RestController
@RequestMapping("/api/admin/book")
@RequiredArgsConstructor
@Slf4j
public class AdminBookController {

    @Autowired
    private final BookService bookService;

    @PostMapping
    public ResponseEntity<BookDTO> createBook(
            @Valid @RequestBody BookDTO bookDTO
    ) throws GenreException, BookException {

        log.info("Received request to create a new book");

        BookDTO created = bookService.createBook(bookDTO);

        log.info("Book created successfully with ID: {}", created.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{bookId}")
    public ResponseEntity<BookDTO> updateBook(
            @PathVariable Long bookId,
            @Valid @RequestBody BookDTO bookDTO
    ) throws BookException, GenreException {

        log.info("Received request to update book with ID: {}", bookId);

        BookDTO updated = bookService.updateBook(bookId, bookDTO);

        log.info("Book updated successfully with ID: {}", bookId);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<ApiResponse> deleteBook(
            @PathVariable Long bookId
    ) throws BookException {

        log.info("Received request to soft delete book with ID: {}", bookId);

        bookService.deleteBook(bookId);

        log.info("Book soft deleted successfully with ID: {}", bookId);

        return ResponseEntity.ok(new ApiResponse("Book deletesed successfully!", true));
    }

    @DeleteMapping("/{bookId}/permanent")
    public ResponseEntity<ApiResponse> hardDeleteBook(
            @PathVariable Long bookId
    ) {

        log.warn("Received request to permanently delete book with ID: {}", bookId);

        bookService.hardDeleteBook(bookId);

        log.info("Book permanently deleted with ID: {}", bookId);

        return ResponseEntity.ok(new ApiResponse("Book deleted permanently!", true));
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<BookDTO>> createBookBulk(
            @Valid @RequestBody List<@Valid BookDTO> bookDTOs
    ) throws GenreException, BookException {

        log.info("Received request to bulk create books. Number of books: {}", bookDTOs.size());

        List<BookDTO> created = bookService.createBookBulk(bookDTOs);

        log.info("Bulk book creation completed successfully. Number of books created: {}", created.size());

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
