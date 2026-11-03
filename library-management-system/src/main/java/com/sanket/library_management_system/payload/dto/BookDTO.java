
package com.sanket.library_management_system.payload.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {

    private Long id;

    @NotBlank(message = "ISBN is required")
    @Pattern(
            regexp = "^(?:\\d{9}[\\dXx]|(?:978|979)\\d{10})$",
            message = "Invalid ISBN Number"
    )
    private String isbn;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Author name is required")
    @Size(max = 255, message = "Author name cannot exceed 255 characters")
    private String author;

    @NotNull(message = "Genre id is mandatory!")
    private Long genreId;

    private String publisher;

    private LocalDateTime publishedAt;

    private String language;

    @Min(value = 1, message = "Book must have at least 1 page")
    @Max(value = 50000, message = "Book cannot exceed 50000 pages")
    private Integer pages;

    private String description;

    @NotNull(message = "Total copies are required")
    @Min(value = 0, message = "Total copies cannot be negative")
    private Integer totalCopies;

    @NotNull(message = "Available copies are required")
    @Min(value = 0, message = "Available copies cannot be negative")
    private Integer availableCopies;

    private BigDecimal price;

    private String coverImageUrl;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
