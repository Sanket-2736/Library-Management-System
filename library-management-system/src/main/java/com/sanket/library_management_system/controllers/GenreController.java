package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.GenreException;
import com.sanket.library_management_system.model.Genre;
import com.sanket.library_management_system.payload.dto.GenreDTO;
import com.sanket.library_management_system.payload.response.ApiResponse;
import com.sanket.library_management_system.services.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;

    @PostMapping("/create")
    public ResponseEntity<GenreDTO> addGenre(GenreDTO genre) {
        GenreDTO createdGenre = genreService.createGenre(genre);
        return ResponseEntity.ok(createdGenre);
    }

    @GetMapping()
    public ResponseEntity<List<GenreDTO>> getAllGenres(){
        return ResponseEntity.ok(genreService.getAllGenres());
    }

    @GetMapping("/{genreId}")
    public ResponseEntity<?> getGenreById(@RequestParam("genreId") Long genreId) throws GenreException {
        GenreDTO genre = genreService.getGenreById(genreId);
        return ResponseEntity.ok(genre);
    }

    @GetMapping("/top-level")
    public ResponseEntity<?> getTopLevelGenre(@RequestParam("genreId") Long genreId) throws GenreException {
        List<GenreDTO> genres = genreService.getTopLevelGenre();
        return ResponseEntity.ok(genres);
    }

    @GetMapping("/count")
    public ResponseEntity<?> getTotalActiveGenres(@RequestParam("genreId") Long genreId) throws GenreException {
        Long count = genreService.getTotalActiveGenres();
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{genreId}")
    public ResponseEntity<?> updateGenre(@RequestParam("genreId") Long genreId, @RequestBody GenreDTO genreDTO) throws GenreException {
        GenreDTO genre = genreService.updateGenre(genreId, genreDTO);
        return ResponseEntity.ok(genre);
    }

    @DeleteMapping("/{genreId}")
    public ResponseEntity<?> deleteGenre(@RequestParam("genreId") Long genreId) throws GenreException {
        genreService.deleteGenre(genreId);
        return ResponseEntity.ok(new ApiResponse("Genre deactivated successfully!", true));
    }

    @DeleteMapping("/{genreId}/hard")
    public ResponseEntity<?> hardDeleteGenre(@RequestParam("genreId") Long genreId) throws GenreException {
        genreService.hardDeleteGenre(genreId);
        return ResponseEntity.ok(new ApiResponse("Genre deleted successfully!", true));
    }
}
