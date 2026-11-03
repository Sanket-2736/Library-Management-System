
package com.sanket.library_management_system.mapper;

import com.sanket.library_management_system.exception.GenreException;
import com.sanket.library_management_system.model.Book;
import com.sanket.library_management_system.payload.dto.BookDTO;
import com.sanket.library_management_system.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookMapper {

    private final GenreRepository genreRepository;

    public BookDTO toDTO(Book book) {

        if (book == null) {
            return null;
        }

        return BookDTO.builder()
                .id(book.getId())
                .isbn(book.getIsbn())
                .title(book.getTitle())
                .author(book.getAuthor())
                .genreId(book.getGenreId())
                .publisher(book.getPublisher())
                .publishedAt(book.getPublishedAt())
                .language(book.getLanguage())
                .pages(book.getPages())
                .description(book.getDescription())
                .totalCopies(book.getTotalCopies())
                .availableCopies(book.getAvailableCopies())
                .price(book.getPrice())
                .coverImageUrl(book.getCoverImageUrl())
                .active(book.getActive())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }

    public Book toEntity(BookDTO bookDTO) throws GenreException {

        if (bookDTO == null) {
            return null;
        }

        validateGenre(bookDTO.getGenreId());

        return Book.builder()
                .id(bookDTO.getId())
                .isbn(bookDTO.getIsbn())
                .title(bookDTO.getTitle())
                .author(bookDTO.getAuthor())
                .genreId(bookDTO.getGenreId())
                .publisher(bookDTO.getPublisher())
                .publishedAt(bookDTO.getPublishedAt())
                .language(bookDTO.getLanguage())
                .pages(bookDTO.getPages())
                .description(bookDTO.getDescription())
                .totalCopies(bookDTO.getTotalCopies())
                .availableCopies(bookDTO.getAvailableCopies())
                .price(bookDTO.getPrice())
                .coverImageUrl(bookDTO.getCoverImageUrl())
                .active(bookDTO.getActive())
                .createdAt(bookDTO.getCreatedAt())
                .updatedAt(bookDTO.getUpdatedAt())
                .build();
    }

    public void updateEntityFromDTO(BookDTO bookDTO, Book existing)
            throws GenreException {

        if (bookDTO == null || existing == null) {
            return;
        }

        // Validate genre existence
        validateGenre(bookDTO.getGenreId());

        // Update existing book fields
        existing.setIsbn(bookDTO.getIsbn());
        existing.setTitle(bookDTO.getTitle());
        existing.setAuthor(bookDTO.getAuthor());
        existing.setGenreId(bookDTO.getGenreId());
        existing.setPublisher(bookDTO.getPublisher());
        existing.setPublishedAt(bookDTO.getPublishedAt());
        existing.setLanguage(bookDTO.getLanguage());
        existing.setPages(bookDTO.getPages());
        existing.setDescription(bookDTO.getDescription());
        existing.setTotalCopies(bookDTO.getTotalCopies());
        existing.setAvailableCopies(bookDTO.getAvailableCopies());
        existing.setPrice(bookDTO.getPrice());
        existing.setCoverImageUrl(bookDTO.getCoverImageUrl());
        existing.setActive(bookDTO.getActive());
    }

    private void validateGenre(Long genreId) throws GenreException {

        if (genreId == null) {
            throw new GenreException("Genre ID is required!");
        }

        genreRepository.findById(genreId)
                .orElseThrow(() -> new GenreException(
                        "Genre not found with ID: " + genreId
                ));
    }
}
