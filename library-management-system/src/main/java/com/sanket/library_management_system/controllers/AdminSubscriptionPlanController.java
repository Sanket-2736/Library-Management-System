
package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.SubscriptionPlanException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.payload.dto.SubscriptionPlanDTO;
import com.sanket.library_management_system.services.SubscriptionPlanService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subscription-plans")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    // Get all subscription plans
    @GetMapping
    public ResponseEntity<List<SubscriptionPlanDTO>> getAllSubscriptionPlans() {
        return ResponseEntity.ok(
                subscriptionPlanService.getAllSubscriptionPlans()
        );
    }

    // Get subscription plan by ID
    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlanDTO> getSubscriptionPlan(
            @PathVariable Long id) throws SubscriptionPlanException {

        return ResponseEntity.ok(
                subscriptionPlanService.getSubscriptionPlan(id)
        );
    }

    // Create subscription plan
    @PostMapping
    public ResponseEntity<SubscriptionPlanDTO> createSubscriptionPlan(
            @Valid @RequestBody SubscriptionPlanDTO dto) throws SubscriptionPlanException, UserException {

        SubscriptionPlanDTO createdPlan =
                subscriptionPlanService.createSubscriptionPlan(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
    }

    // Update subscription plan
    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlanDTO> updateSubscriptionPlan(
            @PathVariable Long id,
            @Valid @RequestBody SubscriptionPlanDTO dto) throws SubscriptionPlanException, UserException {

        return ResponseEntity.ok(
                subscriptionPlanService.updateSubscriptionPlan(id, dto)
        );
    }

    // Soft delete subscription plan
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubscriptionPlan(
            @PathVariable Long id) throws SubscriptionPlanException {

        subscriptionPlanService.deleteSubscriptionPlan(id);

        return ResponseEntity.ok("Subscription plan deactivated successfully!");
    }

    // Permanently delete subscription plan
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<String> hardDeleteSubscriptionPlan(
            @PathVariable Long id) throws SubscriptionPlanException {

        subscriptionPlanService.hardDeleteSubscriptionPlan(id);

        return ResponseEntity.ok("Subscription plan permanently deleted!");
    }
}
