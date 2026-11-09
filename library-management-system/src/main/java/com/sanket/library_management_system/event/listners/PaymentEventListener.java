package com.sanket.library_management_system.event.listners;

import com.sanket.library_management_system.exception.SubscriptionException;
import com.sanket.library_management_system.model.Payment;
import com.sanket.library_management_system.services.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class PaymentEventListener {

    private final SubscriptionService subscriptionService;

    @Async
    @EventListener
    @Transactional
    public void handlePaymentSuccess(Payment payment) throws SubscriptionException {
        switch (payment.getPaymentType()){
            case FINE :
            case LOST_BOOK_REFUND:
            case DAMAGED_BOOK_PENALTY:
                break;

            case MEMBERSHIP:
                subscriptionService.activeSubscription(payment.getSubscription().getId(), payment.getId());
        }
    }

}
