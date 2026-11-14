package com.sanket.library_management_system.services;

import com.sanket.library_management_system.exception.BookException;
import com.sanket.library_management_system.payload.dto.ReservationDTO;
import com.sanket.library_management_system.payload.request.ReservationRequest;
import com.sanket.library_management_system.payload.request.ReservationSearchRequest;
import com.sanket.library_management_system.payload.response.PageResponse;

public interface ReservationService {
    ReservationDTO createReservation(ReservationRequest request);
    ReservationDTO createReservationForUser(ReservationRequest request, Long userId) throws Exception;
    ReservationDTO cancelReservation(Long reservationId) throws Exception;
    ReservationDTO fulfillReservation(Long reservationId) throws Exception;
    PageResponse<ReservationDTO> getMyReservations(ReservationSearchRequest request);
    PageResponse<ReservationDTO> searchReservations(ReservationSearchRequest request);
}
