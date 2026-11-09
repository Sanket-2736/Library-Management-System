package com.sanket.library_management_system.services;

import com.sanket.library_management_system.payload.dto.PaymentDTO;
import com.sanket.library_management_system.payload.request.PaymentInitiateRequest;
import com.sanket.library_management_system.payload.request.PaymentVerifyRequest;
import com.sanket.library_management_system.payload.response.PaymentInitiateResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {
    PaymentInitiateResponse initiatePayment(PaymentInitiateRequest request);
    PaymentDTO verifyPayment(PaymentVerifyRequest req);
    Page<PaymentDTO> getAllPayments(Pageable pageable);
}
