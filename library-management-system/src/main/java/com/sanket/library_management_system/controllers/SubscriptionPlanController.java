
package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.SubscriptionPlanException;
import com.sanket.library_management_system.payload.dto.SubscriptionPlanDTO;
import com.sanket.library_management_system.services.SubscriptionPlanService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscription-plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    @GetMapping
    public ResponseEntity<List<SubscriptionPlanDTO>> getAllSubscriptionPlans() {
        return ResponseEntity.ok(
                subscriptionPlanService.getAllSubscriptionPlans()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlanDTO> getSubscriptionPlan(
            @PathVariable Long id) throws SubscriptionPlanException {

        return ResponseEntity.ok(
                subscriptionPlanService.getSubscriptionPlan(id)
        );
    }
}
