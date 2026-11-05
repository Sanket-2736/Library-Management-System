package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.BookException;
import com.sanket.library_management_system.exception.GenreException;
import com.sanket.library_management_system.payload.dto.BookDTO;
import com.sanket.library_management_system.payload.response.ApiResponse;
import com.sanket.library_management_system.services.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        BookDTO created = bookService.createBook(bookDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Update book
    @PutMapping("/{bookId}")
    public ResponseEntity<BookDTO> updateBook(
            @PathVariable Long bookId,
            @Valid @RequestBody BookDTO bookDTO
    ) throws BookException, GenreException {

        return ResponseEntity.ok(
                bookService.updateBook(bookId, bookDTO)
        );
    }

    // Soft delete book
    @DeleteMapping("/{bookId}")
    public ResponseEntity<ApiResponse> deleteBook(
            @PathVariable Long bookId
    ) throws BookException {

        bookService.deleteBook(bookId);

        return ResponseEntity.ok(new ApiResponse("Book deletesed successfully!", true));
    }

    // Permanently delete book
    @DeleteMapping("/{bookId}/permanent")
    public ResponseEntity<ApiResponse> hardDeleteBook(
            @PathVariable Long bookId
    ) {

        bookService.hardDeleteBook(bookId);

        return ResponseEntity.ok(new ApiResponse("Book deleted permanently!", true));
    }

    // Bulk create books
    @PostMapping("/bulk")
    public ResponseEntity<List<BookDTO>> createBookBulk(
            @Valid @RequestBody List<@Valid BookDTO> bookDTOs
    ) throws GenreException, BookException {

        List<BookDTO> created = bookService.createBookBulk(bookDTOs);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
