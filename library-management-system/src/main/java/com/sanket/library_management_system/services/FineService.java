package com.sanket.library_management_system.services;

import com.sanket.library_management_system.exception.BookException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.payload.domains.FineStatus;
import com.sanket.library_management_system.payload.domains.FineType;
import com.sanket.library_management_system.payload.dto.FineDTO;
import com.sanket.library_management_system.payload.request.CreateFineRequest;
import com.sanket.library_management_system.payload.request.WaiveFineRequest;
import com.sanket.library_management_system.payload.response.PageResponse;
import com.sanket.library_management_system.payload.response.PaymentInitiateResponse;

import java.util.List;

public interface FineService {
    FineDTO createFine(CreateFineRequest request) throws BookException;
    PaymentInitiateResponse payFine(long fineId, String transactionId) throws Exception;
    void markFineAsPaid(Long fineId, Long amount, String transactionId) throws Exception;
    FineDTO waiveFine(WaiveFineRequest request) throws Exception;
    List<FineDTO> getMyFines(FineStatus status, FineType type) throws UserException;
    PageResponse<FineDTO> getAllFines(FineStatus status, FineType type, Long userId, int page, int size);
}
