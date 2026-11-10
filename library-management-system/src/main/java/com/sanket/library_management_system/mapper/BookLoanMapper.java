
package com.sanket.library_management_system.mapper;

import com.sanket.library_management_system.model.BookLoan;
import com.sanket.library_management_system.payload.dto.BookLoanDTO;
import org.springframework.stereotype.Component;

@Component
public class BookLoanMapper {

    public static BookLoanDTO toDTO(BookLoan bookLoan) {

        if (bookLoan == null) {
            return null;
        }

        return BookLoanDTO.builder()
                .id(bookLoan.getId())
                .userId(bookLoan.getUser() != null ? bookLoan.getUser().getId() : null)
                .bookId(bookLoan.getBook() != null ? bookLoan.getBook().getId() : null)
                .type(bookLoan.getType())
                .status(bookLoan.getStatus())
                .checkoutDate(bookLoan.getCheckoutDate())
                .returnDate(bookLoan.getReturnDate())
                .renewalCount(bookLoan.getRenewalCount())
                .maxRenewals(bookLoan.getMaxRenewals())
                .notes(bookLoan.getNotes())
                .isOverdue(bookLoan.getIsOverdue())
                .overdueDays(bookLoan.getOverdueDays())
                .createdAt(bookLoan.getCreatedAt())
                .updatedAt(bookLoan.getUpdatedAt())
                .build();
    }

    public static BookLoan toEntity(BookLoanDTO dto) {

        if (dto == null) {
            return null;
        }

        return BookLoan.builder()
                .id(dto.getId())
                .type(dto.getType())
                .status(dto.getStatus())
                .checkoutDate(dto.getCheckoutDate())
                .returnDate(dto.getReturnDate())
                .renewalCount(dto.getRenewalCount())
                .maxRenewals(dto.getMaxRenewals())
                .notes(dto.getNotes())
                .isOverdue(dto.getIsOverdue())
                .overdueDays(dto.getOverdueDays())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }
}
