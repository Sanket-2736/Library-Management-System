package com.sanket.library_management_system.services;

import com.sanket.library_management_system.exception.BookException;
import com.sanket.library_management_system.exception.GenreException;
import com.sanket.library_management_system.payload.dto.BookDTO;
import com.sanket.library_management_system.payload.request.BookSearchRequest;
import com.sanket.library_management_system.payload.response.PageResponse;

import java.util.List;

public interface BookService {
    BookDTO createBook(BookDTO bookDTO) throws BookException, GenreException;
    BookDTO getBookById(Long bookId) throws BookException;
    BookDTO getBookByISBN(String isbn) throws BookException;
    List<BookDTO> getAllBooks();
    BookDTO updateBook(Long bookId, BookDTO bookDTO) throws BookException, GenreException;
    void deleteBook(Long bookId) throws BookException;
    void hardDeleteBook(Long bookId);
    List<BookDTO> createBookBulk(List<BookDTO> bookDTOs) throws GenreException, BookException;
    PageResponse<BookDTO> searchBookWithFilters(
            BookSearchRequest request
    );
    long getTotalActiveBooks();
    long getTotalAvailableBooks();
}
