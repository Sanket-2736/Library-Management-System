
package com.sanket.library_management_system.mapper;

import com.sanket.library_management_system.model.Reservation;
import com.sanket.library_management_system.payload.dto.ReservationDTO;

public class ReservationMapper {

    public static Reservation toEntity(ReservationDTO dto) {

        if (dto == null) {
            return null;
        }

        return Reservation.builder()
                .id(dto.getId())
                .status(dto.getStatus())
                .reservedAt(dto.getReservedAt())
                .availableAt(dto.getAvailableAt())
                .fulfilledAt(dto.getFulfilledAt())
                .cancelledAt(dto.getCancelledAt())
                .queuePosition(dto.getQueuePosition())
                .notificationSent(dto.getNotificationSent())
                .notes(dto.getNotes())
                .build();
    }

    public static ReservationDTO toDTO(Reservation reservation) {

        if (reservation == null) {
            return null;
        }

        return ReservationDTO.builder()
                .id(reservation.getId())
                .userId(
                        reservation.getUser() != null
                                ? reservation.getUser().getId()
                                : null
                )
                .bookId(
                        reservation.getBook() != null
                                ? reservation.getBook().getId()
                                : null
                )
                .bookTitle(
                        reservation.getBook() != null
                                ? reservation.getBook().getTitle()
                                : null
                )
                .status(reservation.getStatus())
                .reservedAt(reservation.getReservedAt())
                .availableAt(reservation.getAvailableAt())
                .fulfilledAt(reservation.getFulfilledAt())
                .cancelledAt(reservation.getCancelledAt())
                .queuePosition(reservation.getQueuePosition())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .notificationSent(reservation.getNotificationSent())
                .notes(reservation.getNotes())
                .build();
    }
}
