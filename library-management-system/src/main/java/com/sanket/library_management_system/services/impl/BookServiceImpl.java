package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.exception.BookException;
import com.sanket.library_management_system.exception.GenreException;
import com.sanket.library_management_system.mapper.BookMapper;
import com.sanket.library_management_system.model.Book;
import com.sanket.library_management_system.payload.dto.BookDTO;
import com.sanket.library_management_system.payload.request.BookSearchRequest;
import com.sanket.library_management_system.payload.response.PageResponse;
import com.sanket.library_management_system.repository.BookRepository;
import com.sanket.library_management_system.services.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {
    @Autowired
    private final BookRepository bookRepository;

    @Autowired
    private final BookMapper bookMapper;

    @Override
    public BookDTO createBook(BookDTO bookDTO) throws BookException, GenreException {
        if(bookRepository.existsByIsbn(bookDTO.getIsbn())){
            throw  new BookException(
                    "Book with ISBN " + bookDTO.getIsbn() + " already exists!"
            );
        }

        Book book = bookMapper.toEntity(bookDTO);

        if(!book.isAvailableCopiesValid()){
            throw  new BookException("Total copies must be greater than or equal to available copies!");
        }

        Book saved = bookRepository.save(book);
        return bookMapper.toDTO(saved);
    }



    @Override
    public BookDTO getBookById(Long bookId) throws BookException {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new BookException("Requested book not found!"));

        return bookMapper.toDTO(book);
    }

    @Override
    public BookDTO getBookByISBN(String isbn) throws BookException {
        Book book = bookRepository.findByIsbn(isbn).orElseThrow(() -> new BookException("Requested book not found!"));

        return bookMapper.toDTO(book);
    }

    @Override
    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream().map(bookMapper::toDTO).toList();
    }

    @Override
    public BookDTO updateBook(Long bookId, BookDTO bookDTO) throws BookException, GenreException {
        Book existing = bookRepository.findById(bookId).orElseThrow(() -> new BookException("Requested book not found!"));
        bookMapper.updateEntityFromDTO(bookDTO, existing);
        if(!existing.isAvailableCopiesValid()){
            throw  new BookException("Total copies must be greater than or equal to available copies!");
        }

        Book saved = bookRepository.save(existing);
        return bookMapper.toDTO(saved);
    }

    @Override
    public void deleteBook(Long bookId) throws BookException {
        Book existing = bookRepository.findById(bookId).orElseThrow(() -> new BookException("Requested book not found!"));
        existing.setActive(false);
        bookRepository.save(existing);
    }

    @Override
    public void hardDeleteBook(Long bookId) {
        bookRepository.deleteById(bookId);
    }

    @Override
    public List<BookDTO> createBookBulk(List<BookDTO> bookDTOs) throws GenreException, BookException {
        List<BookDTO> res = new ArrayList<BookDTO>();

        for(BookDTO bookDTO : bookDTOs){
            res.add(createBook(bookDTO));
        }
        return res;
    }

    private Pageable createPageable(int page, int size, String sortBy, String sortDirection){
        size = Math.min(size, 10);
        size = Math.max(size, 1);

        Sort sort = sortDirection.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        return PageRequest.of(page, size, sort);
    }

    @Override
    public PageResponse<BookDTO> searchBookWithFilters(BookSearchRequest searchRequest) {
        Pageable pageable = createPageable(
                searchRequest.getPage(),
                searchRequest.getSize(),
                searchRequest.getSortBy(),
                searchRequest.getSortDirection()
        );

        Page<Book> bookPage = bookRepository.searchBooksWithFilter(
                searchRequest.getSearchTerm(),
                searchRequest.getGenreId(),
                searchRequest.getAvailableOnly(),
                pageable
        );

        return convertToPageResponse(bookPage);
    }

    private PageResponse<BookDTO> convertToPageResponse(Page<Book> books){
        List<BookDTO> bookDTOs = books.getContent().stream()
                .map(bookMapper::toDTO)
                .toList();

        return new PageResponse<>(
                bookDTOs,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast(),
                books.isEmpty()
        );
    }

    @Override
    public long getTotalActiveBooks() {
        return bookRepository.countByActiveTrue();
    }

    @Override
    public long getTotalAvailableBooks() {
        return bookRepository.countAvailableBooks();
    }
}
