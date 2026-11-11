package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.payload.dto.PaymentDTO;
import com.sanket.library_management_system.payload.request.PaymentVerifyRequest;
import com.sanket.library_management_system.payload.response.ApiResponse;
import com.sanket.library_management_system.services.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    @Autowired
    private final PaymentService paymentService;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@Valid @RequestBody PaymentVerifyRequest request){
        try {
            log.info("Payment verification requested for orderId: {}", request.getOrderId());
            PaymentDTO dto = paymentService.verifyPayment(request);
            log.info("Payment verified successfully for orderId: {}", request.getOrderId());
            return ResponseEntity.ok(dto);
        } catch (Exception e){
            log.error("Payment verification failed for orderId: {}, Error: {}", request.getOrderId(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(e.getMessage(), false));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        try {
            log.info("Fetching all payments with pagination - page: {}, size: {}, sortBy: {}, sortDir: {}", 
                    page, size, sortBy, sortDir);
            Sort sort = sortDir.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<PaymentDTO> payments = paymentService.getAllPayments(pageable);
            log.info("Successfully fetched {} payments", payments.getContent().size());
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            log.error("Failed to fetch payments, Error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Failed to fetch payments: " + e.getMessage(), false));
        }
    }
}
