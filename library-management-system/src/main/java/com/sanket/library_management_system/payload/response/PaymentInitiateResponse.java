package com.sanket.library_management_system.payload.response;

import com.sanket.library_management_system.payload.domains.PaymentGateway;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitiateResponse {

    private Long paymentId;

    private PaymentGateway gateway;

    private String transactionId;


//    Razorpay specific fields
    private String razorpayOrderId;

    private Long amount;

    private String description;

    private String checkoutUrl;

    private String message;

    private Boolean success;
}
