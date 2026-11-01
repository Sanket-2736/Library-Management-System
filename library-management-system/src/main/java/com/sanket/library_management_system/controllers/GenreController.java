
package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.GenreException;
import com.sanket.library_management_system.payload.dto.GenreDTO;
import com.sanket.library_management_system.payload.response.ApiResponse;
import com.sanket.library_management_system.services.GenreService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;

    // 1. Create a new genre
    @PostMapping("/create")
    public ResponseEntity<GenreDTO> addGenre(
            @Valid @RequestBody GenreDTO genre) {

        GenreDTO createdGenre = genreService.createGenre(genre);
        return ResponseEntity.ok(createdGenre);
    }

    // 2. Get all genres
    @GetMapping
    public ResponseEntity<List<GenreDTO>> getAllGenres() {

        return ResponseEntity.ok(genreService.getAllGenres());
    }

    // 3. Get genre by ID
    @GetMapping("/{genreId}")
    public ResponseEntity<GenreDTO> getGenreById(
            @PathVariable Long genreId) throws GenreException {

        GenreDTO genre = genreService.getGenreById(genreId);
        return ResponseEntity.ok(genre);
    }

    // 4. Get all top-level genres
    @GetMapping("/top-level")
    public ResponseEntity<List<GenreDTO>> getTopLevelGenre() {

        List<GenreDTO> genres = genreService.getTopLevelGenre();
        return ResponseEntity.ok(genres);
    }

    // 5. Get total active genres
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalActiveGenres() {

        Long count = genreService.getTotalActiveGenres();
        return ResponseEntity.ok(count);
    }

    // 6. Get book count by genre ID
    @GetMapping("/{id}/book-count")
    public ResponseEntity<Long> getBookCountByGenre(
            @PathVariable Long id) {

        Long count = genreService.getBookCountByGenreId(id);
        return ResponseEntity.ok(count);
    }

    // 7. Update an existing genre
    @PutMapping("/{genreId}")
    public ResponseEntity<GenreDTO> updateGenre(
            @PathVariable Long genreId,
            @Valid @RequestBody GenreDTO genreDTO) throws GenreException {

        GenreDTO genre = genreService.updateGenre(genreId, genreDTO);
        return ResponseEntity.ok(genre);
    }

    // 8. Soft delete a genre
    @DeleteMapping("/{genreId}")
    public ResponseEntity<ApiResponse> deleteGenre(
            @PathVariable Long genreId) throws GenreException {

        genreService.deleteGenre(genreId);

        return ResponseEntity.ok(
                new ApiResponse("Genre deactivated successfully!", true)
        );
    }

    // 9. Permanently delete a genre
    @DeleteMapping("/{genreId}/hard")
    public ResponseEntity<ApiResponse> hardDeleteGenre(
            @PathVariable Long genreId) throws GenreException {

        genreService.hardDeleteGenre(genreId);

        return ResponseEntity.ok(
                new ApiResponse("Genre deleted successfully!", true)
        );
    }
}
