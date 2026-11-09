package com.sanket.library_management_system.services;

import com.sanket.library_management_system.exception.SubscriptionException;
import com.sanket.library_management_system.exception.SubscriptionPlanException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.payload.dto.SubscriptionDTO;

import com.sanket.library_management_system.payload.response.PaymentInitiateResponse;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface SubscriptionService {
    PaymentInitiateResponse subscribe(SubscriptionDTO subscriptionDTO) throws UserException, SubscriptionPlanException;
    SubscriptionDTO getUsersActiveSubscription(Long userId) throws Exception;
    SubscriptionDTO cancelSubscription(Long subscriptionId, String reason) throws SubscriptionPlanException;
    SubscriptionDTO activeSubscription(Long subscriptionId, Long paymentId) throws SubscriptionException;
    List<SubscriptionDTO> getAllSubscriptions(Pageable pageable);
    void deactivateExpiredSubscription();
}
