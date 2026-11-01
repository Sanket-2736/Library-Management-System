package com.sanket.library_management_system.mapper;

import com.sanket.library_management_system.model.Genre;
import com.sanket.library_management_system.payload.dto.GenreDTO;
import com.sanket.library_management_system.repository.GenreRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class GenreMapper {

    private final GenreRepository genreRepository;
    private final GenreMapper genreMapper;

    public GenreDTO toDTO(Genre saved){
        if(saved == null) return null;

        GenreDTO result = GenreDTO.builder()
                .id(saved.getId())
                .code(saved.getCode())
                .name(saved.getName())
                .description(saved.getDescription())
                .displayOrder(saved.getDisplayOrder())
                .active(saved.getActive())
                .createdAt(saved.getCreatedAt())
                .updatedAt(saved.getUpdatedAt())
                .build();

        if(saved.getParentGenre() != null){
            result.setParentGenreId(saved.getParentGenre().getId());
            result.setParentGenreName(saved.getParentGenre().getName());
        }

        if(saved.getSubGenres() != null && !saved.getSubGenres().isEmpty())
            result.setSubGenre(saved.getSubGenres().stream()
                .filter(Genre::getActive)
                .map(genreMapper::toDTO)
                .collect(Collectors.toList())
        );

//        result.setBookCount((long) (saved.g));

        return result;
    }

    public Genre toEntity(GenreDTO genreDTO){
        Genre genre = Genre.builder()
                .code(genreDTO.getCode())
                .name(genreDTO.getName())
                .description(genreDTO.getDescription())
                .displayOrder(genreDTO.getDisplayOrder())
                .active(true)
                .build();

        if(genreDTO.getParentGenreId() != null){
            genreRepository.findById(genreDTO.getParentGenreId()).ifPresent(genre::setParentGenre);
        }

        return genre;
    }

    public void updateEntityFromDto(GenreDTO dto,Genre genre){
        if(dto == null || genre == null) return;

        genre.setCode(dto.getCode());
        genre.setName(dto.getName());
        genre.setDescription(dto.getDescription());
        genre.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);

        if(dto.getActive() != null){
            genre.setActive(dto.getActive());
        }

        if (dto.getParentGenreId() != null){
            genreRepository.findById(dto.getParentGenreId())
                    .ifPresent(genre::setParentGenre);
        }

    }

    public List<GenreDTO> toDTOList(List<Genre> genreList){
        return genreList.stream().map(genreMapper::toDTO).collect(Collectors.toList());
    }
}
