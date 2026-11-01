package com.sanket.library_management_system.repository;

import com.sanket.library_management_system.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GenreRepository extends JpaRepository<Genre, Long> {
    List<Genre> findByActiveTrueOverByDisplayOrderAsc();
    List<Genre> findByParentGenreIsNullAndActiveTrueOrderByDisplayOrderAsc();
    List<Genre> findByParentGenreIdIsNullAndActiveTrueOrderByDisplayOrderAsc();
    List<Genre> findByParentGenreAndActiveTrueOrderByDisplayOrderAsc(
            Long parentGenreId
    );
    long countByActiveTrue();
//    @Query("select count(b) from book b where b.genre.id=:genreId")
//    long countBooksByGenre(@Param("genreId") Long genreId);
}
