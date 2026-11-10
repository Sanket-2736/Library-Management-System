package com.sanket.library_management_system.payload.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RenewalRequest {
    @NotNull(message = "Book loan ID is required!")
    private Long bookLoanId;

    @Min(value = 1, message = "Extension days must be atleast 1")
    private Integer extensionDays = 14;

    private String notes;

}
