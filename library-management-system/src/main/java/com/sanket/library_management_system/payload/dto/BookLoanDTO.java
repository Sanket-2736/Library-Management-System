
package com.sanket.library_management_system.payload.dto;

import com.sanket.library_management_system.domain.BookLoanStatus;
import com.sanket.library_management_system.domain.BookLoanType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookLoanDTO {

    private Long id;

    private Long userId;
    private Long bookId;

//    private Boolean isActive;

    private BookLoanType type;
    private BookLoanStatus status;

    private LocalDate checkoutDate;
    private LocalDate returnDate;
    private LocalDate dueDate;

    private Integer renewalCount;
    private Integer maxRenewals;

    private String notes;

    private Boolean isOverdue;
    private Integer overdueDays;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

