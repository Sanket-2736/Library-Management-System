
package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.SubscriptionPlanException;
import com.sanket.library_management_system.payload.dto.SubscriptionPlanDTO;
import com.sanket.library_management_system.services.SubscriptionPlanService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/subscription-plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    @GetMapping
    public ResponseEntity<List<SubscriptionPlanDTO>> getAllSubscriptionPlans() {
        try {
            log.info("Fetching all subscription plans");
            List<SubscriptionPlanDTO> plans = subscriptionPlanService.getAllSubscriptionPlans();
            log.info("Successfully fetched {} subscription plans", plans.size());
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            log.error("Failed to fetch subscription plans, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlanDTO> getSubscriptionPlan(
            @PathVariable Long id) throws SubscriptionPlanException {
        try {
            log.info("Fetching subscription plan with id: {}", id);
            SubscriptionPlanDTO plan = subscriptionPlanService.getSubscriptionPlan(id);
            log.info("Subscription plan fetched successfully: {}", plan.getName());
            return ResponseEntity.ok(plan);
        } catch (SubscriptionPlanException e) {
            log.error("Failed to fetch subscription plan with id: {}, Error: {}", id, e.getMessage());
            throw e;
        }
    }
}
