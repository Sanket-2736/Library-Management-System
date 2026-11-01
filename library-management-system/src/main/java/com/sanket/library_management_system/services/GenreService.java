package com.sanket.library_management_system.services;

import com.sanket.library_management_system.exception.GenreException;
import com.sanket.library_management_system.payload.dto.GenreDTO;
import org.hibernate.query.Page;

import java.awt.print.Pageable;
import java.util.List;

public interface GenreService {
    GenreDTO createGenre(GenreDTO genre);
    List<GenreDTO> getAllGenres();
    GenreDTO getGenreById(Long id) throws GenreException;
    GenreDTO updateGenre(Long id, GenreDTO genre) throws GenreException;
    void deleteGenre(Long genreId) throws GenreException;
    void hardDeleteGenre(Long genreId) throws GenreException;
    List<GenreDTO> getAllActiveGenresWithSubGenre();
    List<GenreDTO> getTopLevelGenre();
//    Page<GenreDTO> searchGenres(String searchTerm, Pageable pageable);
    long getTotalActiveGenres();
    long getBookCountByGenreId(Long genreId);

}
