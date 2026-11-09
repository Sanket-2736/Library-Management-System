package com.sanket.library_management_system.payload.dto;

import com.sanket.library_management_system.payload.domains.PaymentGateway;
import com.sanket.library_management_system.payload.domains.PaymentStatus;
import com.sanket.library_management_system.payload.domains.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {

    private Long id;

    private Long userId;

    private String userName;

    private String userEmail;

    private Long subscriptionId;

    private Long bookLoadId;

    private PaymentType paymentType;

    private PaymentStatus paymentStatus;

    private PaymentGateway paymentGateway;

    private Long amount;

    private String transactionId;

    private String gatewayPaymentId;

    private String gatewayOrderId;

    private String gatewaySignature;

    private String description;

    private String failureReason;

    private LocalDateTime initiatedAt;

    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    private LocalDateTime updatedAt;
}