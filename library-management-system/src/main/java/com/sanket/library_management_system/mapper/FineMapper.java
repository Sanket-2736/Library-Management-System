
package com.sanket.library_management_system.mapper;

import com.sanket.library_management_system.model.Fine;
import com.sanket.library_management_system.payload.dto.FineDTO;

public class FineMapper {

    public static Fine toEntity(FineDTO dto) {

        if (dto == null) {
            return null;
        }

        return Fine.builder()
                .id(dto.getId())
                .fineType(dto.getFineType())
                .amount(dto.getAmount())
                .status(dto.getStatus())
                .reason(dto.getReason())
                .notes(dto.getNotes())
                .waiverReason(dto.getWaiverReason())
                .waivedAt(dto.getWaivedAt())
                .paidAt(dto.getPaidAt())
                .transactionId(dto.getTransactionId())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .build();
    }

    public static FineDTO toDTO(Fine fine) {

        if (fine == null) {
            return null;
        }

        return FineDTO.builder()
                .id(fine.getId())
                .userId(fine.getUser() != null
                        ? fine.getUser().getId() : null)
                .bookLoanId(fine.getBookLoan() != null
                        ? fine.getBookLoan().getId() : null)
                .fineType(fine.getFineType())
                .amount(fine.getAmount())
                .waivedAt(fine.getWaivedAt())
                .status(fine.getStatus())
                .reason(fine.getReason())
                .notes(fine.getNotes())
                .waivedByUserId(fine.getWaivedBy() != null
                        ? fine.getWaivedBy().getId() : null)
                .waiverReason(fine.getWaiverReason())
                .paidAt(fine.getPaidAt())
                .processedByUserId(fine.getProcessedBy() != null
                        ? fine.getProcessedBy().getId() : null)
                .transactionId(fine.getTransactionId())
                .createdAt(fine.getCreatedAt())
                .updatedAt(fine.getUpdatedAt())
                .build();
    }
}
