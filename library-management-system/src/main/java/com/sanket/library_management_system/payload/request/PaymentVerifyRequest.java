package com.sanket.library_management_system.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerifyRequest {
    private String razorpayPaymentId;

    private String stripePaymentIntentId;
    private String stripePaymentIntentStatus;
}
