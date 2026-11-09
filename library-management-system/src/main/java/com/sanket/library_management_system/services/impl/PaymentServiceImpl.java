package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.event.publishers.PaymentEventPublisher;
import com.sanket.library_management_system.exception.PaymentException;
import com.sanket.library_management_system.mapper.PaymentMapper;
import com.sanket.library_management_system.model.Payment;
import com.sanket.library_management_system.model.Subscription;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.domains.PaymentGateway;
import com.sanket.library_management_system.payload.domains.PaymentStatus;
import com.sanket.library_management_system.payload.dto.PaymentDTO;
import com.sanket.library_management_system.payload.request.PaymentInitiateRequest;
import com.sanket.library_management_system.payload.request.PaymentVerifyRequest;
import com.sanket.library_management_system.payload.response.PaymentInitiateResponse;
import com.sanket.library_management_system.payload.response.PaymentLinkResponse;
import com.sanket.library_management_system.repository.PaymentRepository;
import com.sanket.library_management_system.repository.SubscriptionRepository;
import com.sanket.library_management_system.repository.UserRepository;
import com.sanket.library_management_system.services.PaymentService;
import com.sanket.library_management_system.services.gateway.RazorpayService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PaymentRepository paymentRepository;

    @Autowired
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    private final PaymentEventPublisher paymentEventPublisher;

    @Autowired
    private final RazorpayService razorpayService;

    @Override
    public PaymentInitiateResponse initiatePayment(PaymentInitiateRequest request) {
        User user = userRepository.findById(request.getUserId()).get();

        Payment payment = Payment.builder()
                .user(user)
                .paymentType(request.getPaymentType())
                .gateway(request.getGateway())
                .amount(request.getAmount())
                .description(request.getDescription())
                .paymentStatus(PaymentStatus.PENDING)
                .transactionId("TXN_" + UUID.randomUUID())
                .initiatedAt(LocalDateTime.now())
                .build();

        if(request.getSubscriptionId() != null){
            Subscription subscription = subscriptionRepository.findById(request.getSubscriptionId())
                    .orElseThrow(() -> new PaymentException("Subscription not found!"));
            payment.setSubscription(subscription);
        }

        payment = paymentRepository.save(payment);

        PaymentInitiateResponse response = new PaymentInitiateResponse();

        if(request.getGateway() == PaymentGateway.RAZORPAY){
            PaymentLinkResponse paymentLinkResponse = razorpayService.createPayment(
                    user, payment
            );

            response = PaymentInitiateResponse.builder()
                    .paymentId(payment.getId())
                    .gateway(payment.getGateway())
                    .checkoutUrl(paymentLinkResponse.getPayment_link_url())
                    .transactionId(paymentLinkResponse.getPayment_link_id())
                    .amount(payment.getAmount())
                    .description(payment.getDescription())
                    .success(true)
                    .message("Payment Initiated successfully!")
                    .build();

            payment.setGatewayOrderId(paymentLinkResponse.getPayment_link_id());
        }

        payment.setPaymentStatus(PaymentStatus.PROCESSING);

        paymentRepository.save(payment);

        return response;
    }

    @Override
    public PaymentDTO verifyPayment(PaymentVerifyRequest req) {
        JSONObject paymentDetails = razorpayService.fetchPaymentDetails(req.getRazorpayPaymentId());
        JSONObject notes = paymentDetails.getJSONObject("notes");
        Long paymentId = Long.parseLong(notes.optString("payment_id"));

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(
                        () -> new PaymentException("Payment not found!")
                );

        boolean isValid = razorpayService.isValidPayment(req.getRazorpayPaymentId());

        if(PaymentGateway.RAZORPAY == payment.getGateway()){
            if (isValid){
                payment.setGatewayOrderId(req.getRazorpayPaymentId());
            }
        }

        if(isValid){
            payment.setPaymentStatus(PaymentStatus.SUCCESS);
            payment.setCompletedAt(LocalDateTime.now());
            payment = paymentRepository.save(payment);
        }

        paymentEventPublisher.publishPaymentSuccessEvent(payment);

        return PaymentMapper.toDTO(payment);
    }

    @Override
    public Page<PaymentDTO> getAllPayments(Pageable pageable) {
        Page<Payment> payments = paymentRepository.findAll(pageable);
        return payments.map(PaymentMapper::toDTO);
    }
}
