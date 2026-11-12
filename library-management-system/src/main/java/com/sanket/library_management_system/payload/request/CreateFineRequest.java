package com.sanket.library_management_system.payload.request;

import com.sanket.library_management_system.payload.domains.FineType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFineRequest {

    @NotNull(message = "Book loan id is required")
    private Long bookLoanId;

    @NotNull(message = "Fine type id is required")
    private FineType fineType;

    @NotNull(message = "Amount is required")
    @PositiveOrZero(message = "Amount must be >= 0")
    private Long amount;

    private String reason;

    private String notes;
}
