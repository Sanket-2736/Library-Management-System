
package com.sanket.library_management_system.payload.dto;

import com.sanket.library_management_system.payload.domains.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDTO {

    private Long id;

    private Long userId;

    private Long bookId;

    private String bookTitle;

    private ReservationStatus status;

    private LocalDateTime reservedAt;

    private LocalDateTime availableAt;

    private LocalDateTime fulfilledAt;

    private LocalDateTime cancelledAt;

    private Integer queuePosition;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Boolean notificationSent;

    private String notes;
}
