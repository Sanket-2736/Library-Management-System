
package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.GenreException;
import com.sanket.library_management_system.payload.dto.GenreDTO;
import com.sanket.library_management_system.payload.response.ApiResponse;
import com.sanket.library_management_system.services.GenreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;

    @PostMapping("/create")
    public ResponseEntity<GenreDTO> addGenre(
            @Valid @RequestBody GenreDTO genre) {

        log.info("Received request to create a new genre");

        GenreDTO createdGenre = genreService.createGenre(genre);

        log.info("Genre created successfully with ID: {}", createdGenre.getId());

        return ResponseEntity.ok(createdGenre);
    }

    @GetMapping
    public ResponseEntity<List<GenreDTO>> getAllGenres() {

        log.info("Received request to fetch all genres");

        List<GenreDTO> genres = genreService.getAllGenres();

        log.info("Successfully fetched {} genres", genres.size());

        return ResponseEntity.ok(genres);
    }

    @GetMapping("/{genreId}")
    public ResponseEntity<GenreDTO> getGenreById(
            @PathVariable Long genreId) throws GenreException {

        log.info("Received request to fetch genre with ID: {}", genreId);

        GenreDTO genre = genreService.getGenreById(genreId);

        log.info("Successfully fetched genre with ID: {}", genreId);

        return ResponseEntity.ok(genre);
    }

    @GetMapping("/top-level")
    public ResponseEntity<List<GenreDTO>> getTopLevelGenre() {

        log.info("Received request to fetch all top-level genres");

        List<GenreDTO> genres = genreService.getTopLevelGenre();

        log.info("Successfully fetched {} top-level genres", genres.size());

        return ResponseEntity.ok(genres);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalActiveGenres() {

        log.info("Received request to fetch total active genres count");

        Long count = genreService.getTotalActiveGenres();

        log.info("Total active genres: {}", count);

        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}/book-count")
    public ResponseEntity<Long> getBookCountByGenre(
            @PathVariable Long id) {

        log.info("Received request to fetch book count for genre ID: {}", id);

        Long count = genreService.getBookCountByGenreId(id);

        log.info("Book count for genre ID {}: {}", id, count);

        return ResponseEntity.ok(count);
    }

    @PutMapping("/{genreId}")
    public ResponseEntity<GenreDTO> updateGenre(
            @PathVariable Long genreId,
            @Valid @RequestBody GenreDTO genreDTO) throws GenreException {

        log.info("Received request to update genre with ID: {}", genreId);

        GenreDTO genre = genreService.updateGenre(genreId, genreDTO);

        log.info("Genre updated successfully with ID: {}", genreId);

        return ResponseEntity.ok(genre);
    }

    @DeleteMapping("/{genreId}")
    public ResponseEntity<ApiResponse> deleteGenre(
            @PathVariable Long genreId) throws GenreException {

        log.info("Received request to deactivate genre with ID: {}", genreId);

        genreService.deleteGenre(genreId);

        log.info("Genre deactivated successfully with ID: {}", genreId);

        return ResponseEntity.ok(
                new ApiResponse("Genre deactivated successfully!", true)
        );
    }

    @DeleteMapping("/{genreId}/hard")
    public ResponseEntity<ApiResponse> hardDeleteGenre(
            @PathVariable Long genreId) throws GenreException {

        log.warn("Received request to permanently delete genre with ID: {}", genreId);

        genreService.hardDeleteGenre(genreId);

        log.info("Genre permanently deleted with ID: {}", genreId);

        return ResponseEntity.ok(
                new ApiResponse("Genre deleted successfully!", true)
        );
    }
}
