package com.sanket.library_management_system.payload.request;

import com.sanket.library_management_system.payload.domains.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationSearchRequest {
    private Long userId;
    private Long bookId;

    private ReservationStatus status;
    private Boolean activeOnly;

    private int page = 0;
    private int size = 20;

    private String sortBy = "reservedAt";
    private String sortDirection = "DESC";
}
