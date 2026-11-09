
package com.sanket.library_management_system.payload.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDTO {

    private Long id;

    @NotBlank(message = "this field is required")
    private String name;

    @NotBlank(message = "this field is required")
    private String planCode;

    private String description;

    @NotNull(message = "this field is required")
    @PositiveOrZero(message = "price cannot be negative")
    private Long price;

    private String currencyCode;

    @NotNull(message = "this field is required")
    private Integer durationDays;

    @NotNull(message = "this field is required")
    private Integer maxBooksAllowed;

    @NotNull(message = "this field is required")
    private Integer maxDaysPerBook;

    private Boolean isActive;

    private Boolean isFeatured;

    private String badgeText;

    private Integer displayOrder;

    private Double monthlyEquivalentPrice;

    private Double priceInMajorUnits;

    private String adminNotes;
}
