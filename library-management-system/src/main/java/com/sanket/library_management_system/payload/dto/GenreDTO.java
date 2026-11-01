package com.sanket.library_management_system.payload.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GenreDTO {

    private Long id;

    @NotBlank(message = "Genre code is mandatory!")
    private String code;

    @NotBlank(message = "Genre name is mandatory!")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters.")
    private String description;

    @Min(value = 0, message = "Display order cannot be negative")
    private Integer displayOrder = 0;

    private Boolean active;
    private Long parentGenreId;

    private String parentGenreName;

    private List<GenreDTO> subGenre;

    private Long bookCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
