
package com.sanket.library_management_system.payload.dto;

import com.sanket.library_management_system.payload.domains.FineStatus;
import com.sanket.library_management_system.payload.domains.FineType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FineDTO {

    private Long id;

    @NotNull(message = "User ID is required!")
    private Long userId;

    @NotNull(message = "Book loan ID is required!")
    private Long bookLoanId;

    @NotNull(message = "Fine Type is required!")
    private FineType fineType;

    @PositiveOrZero(message = "Amount must be greater than or equal to 0.")
    private Long amount;

    @PositiveOrZero(message = "Amount paid must be greater than or equal to 0.")
    private Long amountPaid;

    @NotNull(message = "Fine status is required!")
    private FineStatus status;

    private String reason;
    private String notes;

    private Long waivedByUserId;
    private LocalDateTime waivedAt;
    private String waiverReason;

    private LocalDateTime paidAt;

    private Long processedByUserId;

    private String transactionId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
