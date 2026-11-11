
package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.SubscriptionPlanException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.payload.dto.SubscriptionPlanDTO;
import com.sanket.library_management_system.services.SubscriptionPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subscription-plans")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminSubscriptionPlanController {

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

    @PostMapping
    public ResponseEntity<SubscriptionPlanDTO> createSubscriptionPlan(
            @Valid @RequestBody SubscriptionPlanDTO dto) throws SubscriptionPlanException, UserException {

        log.info("Received request to create a new subscription plan");

        SubscriptionPlanDTO createdPlan =
                subscriptionPlanService.createSubscriptionPlan(dto);

        log.info("Subscription plan created successfully with ID: {}", createdPlan.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlanDTO> updateSubscriptionPlan(
            @PathVariable Long id,
            @Valid @RequestBody SubscriptionPlanDTO dto) throws SubscriptionPlanException, UserException {

        log.info("Received request to update subscription plan with ID: {}", id);

        SubscriptionPlanDTO updatedPlan =
                subscriptionPlanService.updateSubscriptionPlan(id, dto);

        log.info("Subscription plan updated successfully with ID: {}", id);

        return ResponseEntity.ok(updatedPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubscriptionPlan(
            @PathVariable Long id) throws SubscriptionPlanException {

        log.info("Received request to deactivate subscription plan with ID: {}", id);

        subscriptionPlanService.deleteSubscriptionPlan(id);

        log.info("Subscription plan deactivated successfully with ID: {}", id);

        return ResponseEntity.ok("Subscription plan deactivated successfully!");
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<String> hardDeleteSubscriptionPlan(
            @PathVariable Long id) throws SubscriptionPlanException {

        log.warn("Received request to permanently delete subscription plan with ID: {}", id);

        subscriptionPlanService.hardDeleteSubscriptionPlan(id);

        log.info("Subscription plan permanently deleted with ID: {}", id);

        return ResponseEntity.ok("Subscription plan permanently deleted!");
    }
}
