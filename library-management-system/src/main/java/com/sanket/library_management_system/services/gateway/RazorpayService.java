package com.sanket.library_management_system.services.gateway;

import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.sanket.library_management_system.exception.PaymentException;
import com.sanket.library_management_system.model.Payment;
import com.sanket.library_management_system.model.SubscriptionPlan;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.domains.PaymentType;
import com.sanket.library_management_system.payload.response.PaymentLinkResponse;
import com.sanket.library_management_system.repository.SubscriptionPlanRepository;
import com.sanket.library_management_system.services.SubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String razorpayId;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    @Value("${razorpay.callback.base.url}")
    private String callbackBaseUrl;

    @Autowired
    private final SubscriptionPlanService subscriptionPlanService;

    public PaymentLinkResponse createPayment(User user, Payment payment){

        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayId, razorpaySecret);

            Long amountInPaise = payment.getAmount() * (new java.math.BigDecimal("100")).intValue();

            JSONObject paymentLinkRequest = new JSONObject();
            paymentLinkRequest.put("amount", amountInPaise);
            paymentLinkRequest.put("currency", "INR");
            paymentLinkRequest.put("description", payment.getDescription());

            JSONObject customer = new JSONObject();
            customer.put("name", user.getFullName());
            customer.put("name", user.getEmail());

            if(user.getPhone() != null) customer.put("contact", user.getPhone());

            paymentLinkRequest.put("customer", customer);

            JSONObject notify = new JSONObject();
            notify.put("email", true);
            notify.put("sms", user.getPhone() != null);

            paymentLinkRequest.put("notify", notify);

            paymentLinkRequest.put("reminder_enable", true);

            String successUrl = callbackBaseUrl + "/payment-success/" + payment.getId();
            String cancelUrl = callbackBaseUrl + "/payment-cancelled/" + payment.getId();

            paymentLinkRequest.put("callback_url", successUrl);
            paymentLinkRequest.put("callback_method", "get");

            JSONObject notes = new JSONObject();
            notes.put("user_id", user.getId());
            notes.put("payment_id", payment.getId());

            if(payment.getPaymentType() == PaymentType.MEMBERSHIP){
                notes.put("subscription_id", payment.getSubscription().getId());
                notes.put("plan", payment.getSubscription().getPlan().getPlanCode());
                notes.put("type", PaymentType.MEMBERSHIP);
            } else if (payment.getPaymentType() == PaymentType.FINE) {
//                notes.put("fine_id", payment.getFine().getId());
                notes.put("type", PaymentType.FINE);
            }

            paymentLinkRequest.put("notes", notes);

            PaymentLink paymentLink =razorpayClient.paymentLink.create(paymentLinkRequest);

            String paymentUrl = paymentLink.get("short_url");
            String paymentLinkId = paymentLink.get("id");

            return PaymentLinkResponse.builder()
                    .payment_link_id(paymentLinkId)
                    .payment_link_url(paymentUrl)
                    .build();
        } catch (RazorpayException e){
            throw new RuntimeException(e.getMessage());
        }
    }

    public JSONObject fetchPaymentDetails(String paymentId){
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayId, razorpaySecret);

            com.razorpay.Payment payment = razorpayClient.payments.fetch(paymentId);

            return payment.toJson();
        } catch (RazorpayException e) {
            throw new PaymentException(e.getMessage());
        }
    }

    public boolean isValidPayment(String paymentId){
        try {
            JSONObject paymentDetails = fetchPaymentDetails(
                    paymentId
            );

            String status = paymentDetails.optString("status");

            long amount = paymentDetails.optLong("amount");
            long amountInRupees = amount / 100;

            JSONObject notes = paymentDetails.optJSONObject("notes");

            String paymentType = paymentDetails.optString("type");

            if(!"captured".equalsIgnoreCase(status)){
                return false;
            }

            if(paymentType.equals(PaymentType.MEMBERSHIP.toString())){
                String planCode = notes.optString("plan");

                SubscriptionPlan subscriptionPlan = subscriptionPlanService.getBySubscriptionPlanCode(planCode);

                return amountInRupees == subscriptionPlan.getPrice();
            } else if (paymentType.equals(PaymentType.FINE.toString())) {
//                Long fineId = notes.getLong("fine_id");
//                Fine fine = fineRepository.findById(fineId).orElseThrow(
//                        () -> new Exception("Fine entry not found!")
//                );
//
//                return fine.getAmount() == amountInRupees;
                return false;
            }

            return true;
        } catch (Exception e) {
            throw new PaymentException(e.getMessage());
        }
    }
}
