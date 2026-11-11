
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

        log.info("Received request to fetch all subscription plans");

        List<SubscriptionPlanDTO> plans = subscriptionPlanService.getAllSubscriptionPlans();

        log.info("Successfully fetched {} subscription plans", plans.size());

        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlanDTO> getSubscriptionPlan(
            @PathVariable Long id) throws SubscriptionPlanException {

        log.info("Received request to fetch subscription plan with ID: {}", id);

        SubscriptionPlanDTO plan = subscriptionPlanService.getSubscriptionPlan(id);

        log.info("Successfully fetched subscription plan with ID: {}", id);

        return ResponseEntity.ok(plan);
    }
}
