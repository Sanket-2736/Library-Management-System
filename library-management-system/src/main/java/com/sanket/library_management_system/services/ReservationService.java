package com.sanket.library_management_system.services;

import com.sanket.library_management_system.payload.dto.ReservationDTO;
import com.sanket.library_management_system.payload.request.ReservationRequest;
import com.sanket.library_management_system.payload.request.ReservationSearchRequest;
import com.sanket.library_management_system.payload.response.PageResponse;

public interface ReservationService {
    ReservationDTO createReservation(ReservationRequest request);
    ReservationDTO createReservationForUser(ReservationRequest request, Long userId);
    ReservationDTO cancelReservation(ReservationRequest request);
    ReservationDTO fulfillReservation(ReservationRequest request);
    PageResponse<ReservationDTO> getMyReservations(ReservationSearchRequest request)
    PageResponse<ReservationDTO> searchReservations(ReservationSearchRequest request)
}
