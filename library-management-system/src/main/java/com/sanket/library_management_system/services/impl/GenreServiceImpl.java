package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.exception.GenreException;
import com.sanket.library_management_system.mapper.GenreMapper;
import com.sanket.library_management_system.model.Genre;
import com.sanket.library_management_system.payload.dto.GenreDTO;
import com.sanket.library_management_system.repository.GenreRepository;
import com.sanket.library_management_system.services.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GenreServiceImpl implements GenreService {
    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private final GenreMapper genreMapper;

    public GenreServiceImpl(GenreMapper genreMapper) {
        this.genreMapper = genreMapper;
    }

    @Override
    public GenreDTO createGenre(GenreDTO genreDTO) {
//        return genreRepository.save(genre);
        Genre genre = genreMapper.toEntity(genreDTO);

        Genre saved = genreRepository.save(genre);

        return genreMapper.toDTO(saved);
    }

    @Override
    public List<GenreDTO> getAllGenres() {
        return genreRepository.findAll().stream()
                .map(genreMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public GenreDTO getGenreById(Long id) throws GenreException {
        return genreMapper.toDTO(genreRepository.findById(id).orElseThrow(() -> new GenreException("Genre with given id not found!")));
    }

    @Override
    public GenreDTO updateGenre(Long id, GenreDTO genre) throws GenreException {
        Genre existingGenre = genreRepository.findById(id).orElseThrow(() -> new GenreException(
                "Genre with the provided id not found!"
        ));
        genreMapper.updateEntityFromDto(genre, existingGenre);
        Genre updated = genreRepository.save(existingGenre);
        return genreMapper.toDTO(updated);
    }

    @Override
    public void deleteGenre(Long genreId) throws GenreException {
        Genre existingGenre = genreRepository.findById(genreId).orElseThrow(() -> new GenreException("Genre not found!"));

        existingGenre.setActive(false);
        genreRepository.save(existingGenre);
    }

    @Override
    public void hardDeleteGenre(Long genreId) throws GenreException {
        Genre existingGenre = genreRepository.findById(genreId).orElseThrow(() -> new GenreException("Genre not found!"));
        genreRepository.delete(existingGenre);
    }

    @Override
    public List<GenreDTO> getAllActiveGenresWithSubGenre() {
        List<Genre> topLevelGenres = genreRepository.findByParentGenreIdIsNullAndActiveTrueOrderByDisplayOrderAsc();
        return genreMapper.toDTOList(topLevelGenres);
    }

    @Override
    public List<GenreDTO> getTopLevelGenre() {
        List<Genre> topLevelGenres = genreRepository.findByParentGenreIdIsNullAndActiveTrueOrderByDisplayOrderAsc();
        return genreMapper.toDTOList(topLevelGenres);
    }

    @Override
    public long getTotalActiveGenres() {
        return genreRepository.countByActiveTrue();
    }

    @Override
    public long getBookCountByGenreId(Long genreId) {
        return 0;
    }
}
