package com.sanket.library_management_system.payload.request;

import com.sanket.library_management_system.payload.domains.PaymentGateway;
import com.sanket.library_management_system.payload.domains.PaymentType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitiateRequest {
    @NotNull(message = "User ID is mandatory")
    private Long id;

    private Long userId;

    private Long bookLoadId;
    @NotNull(message = "Payment Type is mandatory")
    private PaymentType paymentType;

    @NotNull(message = "Payment Gateway is mandatory")
    private PaymentGateway gateway;

    @NotNull(message = "Amount is mandatory")
    @Positive(message = "Amount must be positve")
    private Long amount;

    @Size(max = 500, message = "Description must be max 500 characters long")
    private String description;

    private Long fineId;
    private Long subscriptionId;

    @Size(max = 500, message = "Success URL must be max 500 characters long")
    private String successUrl;

    @Size(max = 500, message = "Cancel URL must be max 500 characters long")
    private String cancelURL;
}
