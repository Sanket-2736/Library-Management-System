package com.sanket.library_management_system.payload.request;

import com.sanket.library_management_system.domain.BookLoanStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckinRequest {

    @NotNull(message = "Book loan ID is mandatory")
    private Long bookLoanId;

    private BookLoanStatus condition = BookLoanStatus.RETURNED;

    private String notes;
}
