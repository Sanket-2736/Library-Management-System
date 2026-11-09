
package com.sanket.library_management_system.mapper;

import com.sanket.library_management_system.model.Payment;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.model.Subscription;
import com.sanket.library_management_system.payload.dto.PaymentDTO;

public class PaymentMapper {

    private PaymentMapper() {
        // Utility class
    }

    // Convert PaymentDTO to Payment Entity
    public static Payment toEntity(PaymentDTO dto) {

        if (dto == null) {
            return null;
        }

        Payment payment = new Payment();

        if (dto.getUserId() != null) {
            User user = new User();
            user.setId(dto.getUserId());
            payment.setUser(user);
        }

        if (dto.getSubscriptionId() != null) {
            Subscription subscription = new Subscription();
            subscription.setId(dto.getSubscriptionId());
            payment.setSubscription(subscription);
        }

        if (dto.getPaymentType() != null) {
            payment.setPaymentType(dto.getPaymentType());
        }

        if (dto.getPaymentStatus() != null) {
            payment.setPaymentStatus(dto.getPaymentStatus());
        }

        if (dto.getPaymentGateway() != null) {
            payment.setGateway(dto.getPaymentGateway());
        }

        if (dto.getAmount() != null) {
            payment.setAmount(dto.getAmount());
        }

        if (dto.getTransactionId() != null) {
            payment.setTransactionId(dto.getTransactionId());
        }

        if (dto.getGatewayPaymentId() != null) {
            payment.setGatewayPaymentId(dto.getGatewayPaymentId());
        }

        if (dto.getGatewayOrderId() != null) {
            payment.setGatewayOrderId(dto.getGatewayOrderId());
        }

        if (dto.getGatewaySignature() != null) {
            payment.setGatewaySignature(dto.getGatewaySignature());
        }

        if (dto.getDescription() != null) {
            payment.setDescription(dto.getDescription());
        }

        if (dto.getFailureReason() != null) {
            payment.setFailureReason(dto.getFailureReason());
        }

        if (dto.getInitiatedAt() != null) {
            payment.setInitiatedAt(dto.getInitiatedAt());
        }

        if (dto.getCreatedAt() != null) {
            payment.setCreatedAt(dto.getCreatedAt());
        }

        if (dto.getCompletedAt() != null) {
            payment.setCompletedAt(dto.getCompletedAt());
        }

        if (dto.getUpdatedAt() != null) {
            payment.setUpdatedAt(dto.getUpdatedAt());
        }

        return payment;
    }

    // Convert Payment Entity to PaymentDTO
    public static PaymentDTO toDTO(Payment payment) {

        if (payment == null) {
            return null;
        }

        PaymentDTO dto = new PaymentDTO();

        if (payment.getId() != null) {
            dto.setId(payment.getId());
        }

        if (payment.getUser() != null) {

            if (payment.getUser().getId() != null) {
                dto.setUserId(payment.getUser().getId());
            }

            if (payment.getUser().getFullName() != null) {
                dto.setUserName(payment.getUser().getFullName());
            }

            if (payment.getUser().getEmail() != null) {
                dto.setUserEmail(payment.getUser().getEmail());
            }
        }

        if (payment.getSubscription() != null) {
            if (payment.getSubscription().getId() != null) {
                dto.setSubscriptionId(payment.getSubscription().getId());
            }
        }

        if (payment.getPaymentType() != null) {
            dto.setPaymentType(payment.getPaymentType());
        }

        if (payment.getPaymentStatus() != null) {
            dto.setPaymentStatus(payment.getPaymentStatus());
        }

        if (payment.getGateway() != null) {
            dto.setPaymentGateway(payment.getGateway());
        }

        if (payment.getAmount() != null) {
            dto.setAmount(payment.getAmount());
        }

        if (payment.getTransactionId() != null) {
            dto.setTransactionId(payment.getTransactionId());
        }

        if (payment.getGatewayPaymentId() != null) {
            dto.setGatewayPaymentId(payment.getGatewayPaymentId());
        }

        if (payment.getGatewayOrderId() != null) {
            dto.setGatewayOrderId(payment.getGatewayOrderId());
        }

        if (payment.getGatewaySignature() != null) {
            dto.setGatewaySignature(payment.getGatewaySignature());
        }

        if (payment.getDescription() != null) {
            dto.setDescription(payment.getDescription());
        }

        if (payment.getFailureReason() != null) {
            dto.setFailureReason(payment.getFailureReason());
        }

        if (payment.getInitiatedAt() != null) {
            dto.setInitiatedAt(payment.getInitiatedAt());
        }

        if (payment.getCreatedAt() != null) {
            dto.setCreatedAt(payment.getCreatedAt());
        }

        if (payment.getCompletedAt() != null) {
            dto.setCompletedAt(payment.getCompletedAt());
        }

        if (payment.getUpdatedAt() != null) {
            dto.setUpdatedAt(payment.getUpdatedAt());
        }

        return dto;
    }
}
