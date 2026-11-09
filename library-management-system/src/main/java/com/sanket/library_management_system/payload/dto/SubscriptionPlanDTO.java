package com.sanket.library_management_system.payload.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlanDTO {

    private Long id;

    @NotNull(message = "Plan code is required!")
    private String planCode;

    @NotNull(message = "Plan name is required!")
    private String name;

    private String description;

    @NotNull(message = "Plan code is required!")
    private Integer durationDays;

    @NotNull(message = "Plan code is required!")
    private Long price;

    private String currencyCode;

    @NotNull(message = "Plan code is required!")
    @Positive(message = "Max books must be positive!")
    private Integer maxBooksAllowed;

    @NotNull(message = "Plan code is required!")
    @Positive(message = "Max days must be positive!")
    private Integer maxDaysPerBook;

    private Integer displayOrder;

    private Boolean isActive ;

    private Boolean isFeatured;

    private String badgeText;

    private String adminNotes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String updatedBy;
    private String createdBy;
}
