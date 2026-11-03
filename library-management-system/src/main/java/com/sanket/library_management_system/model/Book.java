package com.sanket.library_management_system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, unique = true)
    @Pattern(regexp = "^(?:\\d{9}[\\dXx]|(?:978|979)\\d{10})$", message = "Invalid ISBN Number")
    private String isbn;

    @Column(nullable = false)
    @Size(min = 1, max = 255, message = "Title must be between 1 to 255 characters")
    private String title;

    @Column(nullable = false)
    @Size(min = 1, max = 255, message = "Author name must be between 1 to 255 characters")
    private String author;

    @NotNull(message = "Genre id is mandatory!")
    private Long genreId;

    private String publisher;

    private LocalDateTime publishedAt;

    private String language;

    @Min(value = 1, message = "Book must have atleast 1 page")
    @Max(value = 50000, message = "Book must have atmost 50000 page")
    private Integer pages;

    private String description;

    private Integer totalCopies;

    private Integer availableCopies;

    private BigDecimal price;

    private String coverImageUrl;

    private Boolean active;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @AssertTrue(message = "Available copies cannot exceed total copies!")
    public boolean isAvailableCopiesValid(){
        if(totalCopies == null || availableCopies == null) return true;
        return availableCopies <= totalCopies;
    }
}
