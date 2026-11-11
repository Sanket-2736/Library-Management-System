
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

    // 1. Create a new genre
    @PostMapping("/create")
    public ResponseEntity<GenreDTO> addGenre(
            @Valid @RequestBody GenreDTO genre) {
        try {
            log.info("Creating new genre with code: {}, name: {}", genre.getCode(), genre.getName());
            GenreDTO createdGenre = genreService.createGenre(genre);
            log.info("Genre created successfully with id: {}", createdGenre.getId());
            return ResponseEntity.ok(createdGenre);
        } catch (Exception e) {
            log.error("Failed to create genre with code: {}, Error: {}", genre.getCode(), e.getMessage(), e);
            throw e;
        }
    }

    // 2. Get all genres
    @GetMapping
    public ResponseEntity<List<GenreDTO>> getAllGenres() {
        try {
            log.info("Fetching all genres");
            List<GenreDTO> genres = genreService.getAllGenres();
            log.info("Successfully fetched {} genres", genres.size());
            return ResponseEntity.ok(genres);
        } catch (Exception e) {
            log.error("Failed to fetch all genres, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    // 3. Get genre by ID
    @GetMapping("/{genreId}")
    public ResponseEntity<GenreDTO> getGenreById(
            @PathVariable Long genreId) throws GenreException {
        try {
            log.info("Fetching genre with id: {}", genreId);
            GenreDTO genre = genreService.getGenreById(genreId);
            log.info("Genre fetched successfully: {}", genre.getName());
            return ResponseEntity.ok(genre);
        } catch (GenreException e) {
            log.error("Failed to fetch genre with id: {}, Error: {}", genreId, e.getMessage());
            throw e;
        }
    }

    // 4. Get all top-level genres
    @GetMapping("/top-level")
    public ResponseEntity<List<GenreDTO>> getTopLevelGenre() {
        try {
            log.info("Fetching top-level genres");
            List<GenreDTO> genres = genreService.getTopLevelGenre();
            log.info("Successfully fetched {} top-level genres", genres.size());
            return ResponseEntity.ok(genres);
        } catch (Exception e) {
            log.error("Failed to fetch top-level genres, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    // 5. Get total active genres
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalActiveGenres() {
        try {
            log.info("Fetching total active genres count");
            Long count = genreService.getTotalActiveGenres();
            log.info("Total active genres count: {}", count);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("Failed to fetch genres count, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    // 6. Get book count by genre ID
    @GetMapping("/{id}/book-count")
    public ResponseEntity<Long> getBookCountByGenre(
            @PathVariable Long id) {
        try {
            log.info("Fetching book count for genre id: {}", id);
            Long count = genreService.getBookCountByGenreId(id);
            log.info("Book count for genre id {}: {}", id, count);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("Failed to fetch book count for genre id: {}, Error: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    // 7. Update an existing genre
    @PutMapping("/{genreId}")
    public ResponseEntity<GenreDTO> updateGenre(
            @PathVariable Long genreId,
            @Valid @RequestBody GenreDTO genreDTO) throws GenreException {
        try {
            log.info("Updating genre with id: {}", genreId);
            GenreDTO genre = genreService.updateGenre(genreId, genreDTO);
            log.info("Genre updated successfully: {}", genre.getName());
            return ResponseEntity.ok(genre);
        } catch (GenreException e) {
            log.error("Failed to update genre with id: {}, Error: {}", genreId, e.getMessage());
            throw e;
        }
    }

    // 8. Soft delete a genre
    @DeleteMapping("/{genreId}")
    public ResponseEntity<ApiResponse> deleteGenre(
            @PathVariable Long genreId) throws GenreException {
        try {
            log.info("Soft deleting genre with id: {}", genreId);
            genreService.deleteGenre(genreId);
            log.info("Genre soft deleted successfully: {}", genreId);
            return ResponseEntity.ok(
                    new ApiResponse("Genre deactivated successfully!", true)
            );
        } catch (GenreException e) {
            log.error("Failed to soft delete genre with id: {}, Error: {}", genreId, e.getMessage());
            throw e;
        }
    }

    // 9. Permanently delete a genre
    @DeleteMapping("/{genreId}/hard")
    public ResponseEntity<ApiResponse> hardDeleteGenre(
            @PathVariable Long genreId) throws GenreException {
        try {
            log.info("Hard deleting genre with id: {}", genreId);
            genreService.hardDeleteGenre(genreId);
            log.info("Genre hard deleted successfully: {}", genreId);
            return ResponseEntity.ok(
                    new ApiResponse("Genre deleted successfully!", true)
            );
        } catch (GenreException e) {
            log.error("Failed to hard delete genre with id: {}, Error: {}", genreId, e.getMessage());
            throw e;
        }
    }
}
