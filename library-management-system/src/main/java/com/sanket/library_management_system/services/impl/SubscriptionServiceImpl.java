package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.exception.SubscriptionException;
import com.sanket.library_management_system.exception.SubscriptionPlanException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.mapper.SubscriptionMapper;
import com.sanket.library_management_system.model.Subscription;
import com.sanket.library_management_system.model.SubscriptionPlan;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.dto.SubscriptionDTO;
import com.sanket.library_management_system.repository.SubscriptionPlanRepository;
import com.sanket.library_management_system.repository.SubscriptionRepository;
import com.sanket.library_management_system.services.SubscriptionService;
import com.sanket.library_management_system.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.awt.print.Pageable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    @Autowired
    private final SubscriptionRepository subscriptionRepository;

    @Autowired
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    @Autowired
    private final UserService userService;

    @Autowired
    private final SubscriptionMapper subscriptionMapper;

    @Override
    public SubscriptionDTO subscribe(SubscriptionDTO subscriptionDTO) throws UserException, SubscriptionPlanException {
        User user = userService.getCurrentUser();

        SubscriptionPlan plan = subscriptionPlanRepository.findById(subscriptionDTO.getId())
                .orElseThrow(() ->
                        new SubscriptionPlanException("Subscription plan not found!")
                );

        Subscription subscription = subscriptionMapper.toEntity(subscriptionDTO);

        subscription.initializeFromPlan();
        subscription.setIsActive(false);

        Subscription savedSubscription = subscriptionRepository.save(subscription);


        return subscriptionMapper.toDTO(savedSubscription);
    }

    @Override
    public SubscriptionDTO getUsersActiveSubscription(Long userId) throws Exception {
        User user = userService.getCurrentUser();

        Subscription subscription = subscriptionRepository.findActiveSubscriptionByUserId(user.getId(), LocalDate.now())
                .
                orElseThrow(() -> new Exception("No active subscription found!"));
        return subscriptionMapper.toDTO(subscription);
    }

    @Override
    public SubscriptionDTO cancelSubscription(Long subscriptionId, String reason) throws SubscriptionPlanException {
        Subscription subscription = subscriptionRepository.findById(subscriptionId).orElseThrow(() -> new SubscriptionPlanException("Subscriptoin not found!"));

        subscription.setIsActive(false);
        subscription.setCancelledAt(LocalDateTime.now());
        subscription.setCancellationReason(reason == null ? "Cancelled by user" : reason);

        subscription = subscriptionRepository.save(subscription);

        return subscriptionMapper.toDTO(subscription);
    }

    @Override
    public SubscriptionDTO activeSubscription(Long subscriptionId, Long paymentId) throws SubscriptionException {
        Subscription subscription = subscriptionRepository.findById(subscriptionId).orElseThrow(() -> new SubscriptionException("Subscription not found!"));

        subscription.setIsActive(false);

        subscription.setStartDate(LocalDate.now());
        subscription.calculateEndDate();

        subscription = subscriptionRepository.save(subscription);

        return subscriptionMapper.toDTO(subscription);
    }

    @Override
    public List<SubscriptionDTO> getAllSubscriptions(Pageable pageable) {
        List<Subscription> subscriptions = subscriptionRepository.findAll();
        return subscriptions.stream().map(subscriptionMapper::toDTO).toList();
    }

    @Override
    public void deactivateExpiredSubscription() {
        List<Subscription> subscriptions = subscriptionRepository.findExpiredActiveSubscriptions(LocalDate.now());

        for(Subscription subscription : subscriptions){
            subscription.setIsActive(false);
            subscription = subscriptionRepository.save(subscription);
        }
    }
}
