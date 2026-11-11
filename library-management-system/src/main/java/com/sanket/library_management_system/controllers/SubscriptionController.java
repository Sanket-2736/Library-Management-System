package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.SubscriptionException;
import com.sanket.library_management_system.exception.SubscriptionPlanException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.payload.dto.SubscriptionDTO;
import com.sanket.library_management_system.payload.response.ApiResponse;
import com.sanket.library_management_system.payload.response.PageResponse;
import com.sanket.library_management_system.services.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    @Autowired
    private final SubscriptionService subscriptionService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@Valid @RequestBody SubscriptionDTO dto) throws UserException, SubscriptionPlanException {
        try {
            log.info("New subscription request for user id: {}, plan id: {}", dto.getUserId(), dto.getPlanId());
            SubscriptionDTO response = subscriptionService.subscribe(dto);
            log.info("Subscription created successfully with id: {}", response.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Subscription creation failed, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("/cancel/{subscriptionId}")
    public ResponseEntity<?> cancelSubscription(
            @PathVariable Long subscriptionId,
            @RequestBody(required = false) String reason)
            throws UserException, SubscriptionPlanException {
        try {
            log.info("Cancelling subscription id: {} with reason: {}", subscriptionId, reason);
            SubscriptionDTO dto = subscriptionService.cancelSubscription(subscriptionId, reason);
            log.info("Subscription cancelled successfully: {}", subscriptionId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            log.error("Subscription cancellation failed for id: {}, Error: {}", subscriptionId, e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("/activate")
    public ResponseEntity<?> activateSubscription(@RequestParam Long subscriptionId) throws UserException, SubscriptionPlanException, SubscriptionException {
        try {
            log.info("Activating subscription id: {}", subscriptionId);
            SubscriptionDTO dto1 = subscriptionService.activeSubscription(subscriptionId, null);
            log.info("Subscription activated successfully: {}", subscriptionId);
            return ResponseEntity.ok(dto1);
        } catch (Exception e) {
            log.error("Subscription activation failed for id: {}, Error: {}", subscriptionId, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/admin")
    public ResponseEntity<?> getAllSubscriptions(){
        try {
            log.info("Fetching all subscriptions for admin");
            int page = 0;
            int size = 10;
            Pageable pageable = (Pageable) PageRequest.of(page, size);
            List<SubscriptionDTO> dtoList = subscriptionService.getAllSubscriptions(pageable);
            log.info("Successfully fetched {} subscriptions", dtoList.size());
            return  ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            log.error("Failed to fetch subscriptions, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/admin/deactivate-expired")
    public ResponseEntity<?> deactivateExpiredSubscriptions(){
        try {
            log.info("Deactivating expired subscriptions");
            int page = 0;
            int size = 10;
            Pageable pageable = (Pageable) PageRequest.of(page, size);
            subscriptionService.deactivateExpiredSubscription();
            log.info("Expired subscriptions deactivated successfully");
            return  ResponseEntity.ok(new ApiResponse(
                    "Subscriptions deactivated successfully!", true
            ));
        } catch (Exception e) {
            log.error("Failed to deactivate expired subscriptions, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/user/active")
    public ResponseEntity<?> getUsersActiveSubscription(@RequestParam(required = false) Long userId) throws Exception {
        try {
            log.info("Fetching active subscription for user id: {}", userId);
            SubscriptionDTO subscriptionDTO = subscriptionService.getUsersActiveSubscription(userId);
            log.info("Active subscription fetched successfully");
            return ResponseEntity.ok(subscriptionDTO);
        } catch (Exception e) {
            log.error("Failed to fetch active subscription for user id: {}, Error: {}", userId, e.getMessage(), e);
            throw e;
        }
    }
}
