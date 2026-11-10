package com.sanket.library_management_system.payload.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CheckoutRequest {
    @NotNull(message = "Book ID is mandatory")
    private Long bookId;

    @Min(value = 1, message = "Checkout days must be atleast 1")
    private Integer checkoutDays = 14;

    private String notes;
}
