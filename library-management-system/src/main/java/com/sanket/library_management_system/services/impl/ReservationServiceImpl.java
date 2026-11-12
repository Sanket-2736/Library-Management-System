package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.payload.dto.ReservationDTO;
import com.sanket.library_management_system.payload.request.ReservationRequest;
import com.sanket.library_management_system.payload.request.ReservationSearchRequest;
import com.sanket.library_management_system.payload.response.PageResponse;
import com.sanket.library_management_system.services.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {
    @Override
    public ReservationDTO createReservation(ReservationRequest request) {
        return null;
    }

    @Override
    public ReservationDTO createReservationForUser(ReservationRequest request, Long userId) {
        return null;
    }

    @Override
    public ReservationDTO cancelReservation(ReservationRequest request) {
        return null;
    }

    @Override
    public ReservationDTO fulfillReservation(ReservationRequest request) {
        return null;
    }

    @Override
    public PageResponse<ReservationDTO> getMyReservations(ReservationSearchRequest request) {
        return null;
    }

    @Override
    public PageResponse<ReservationDTO> searchReservations(ReservationSearchRequest request) {
        return null;
    }
}
