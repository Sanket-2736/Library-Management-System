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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    @Autowired
    private final SubscriptionService subscriptionService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@Valid @RequestBody SubscriptionDTO dto) throws UserException, SubscriptionPlanException {
        return ResponseEntity.ok(subscriptionService.subscribe(dto));
    }

    @PostMapping("/cancel/{subscriptionId}")
    public ResponseEntity<?> cancelSubscription(
            @PathVariable Long subscriptionId,
            @RequestBody(required = false) String reason)
            throws UserException, SubscriptionPlanException {

        SubscriptionDTO dto =
                subscriptionService.cancelSubscription(subscriptionId, reason);

        return ResponseEntity.ok(dto);
    }


    @PostMapping("/activate")
    public ResponseEntity<?> activateSubscription(@RequestParam Long subscriptionId) throws UserException, SubscriptionPlanException, SubscriptionException {
        SubscriptionDTO dto1 = subscriptionService.activeSubscription(subscriptionId, null);
        return ResponseEntity.ok(dto1);
    }

    @GetMapping("/admin")
    public ResponseEntity<?> getAllSubscriptions(){
        int page = 0;
        int size = 10;
        Pageable pageable = (Pageable) PageRequest.of(page, size);
        List<SubscriptionDTO> dtoList = subscriptionService.getAllSubscriptions(pageable);
        return  ResponseEntity.ok(dtoList);
    }

    @GetMapping("/admin/deactivate-expired")
    public ResponseEntity<?> deactivateExpiredSubscriptions(){
        int page = 0;
        int size = 10;
        Pageable pageable = (Pageable) PageRequest.of(page, size);
        subscriptionService.deactivateExpiredSubscription();
        return  ResponseEntity.ok(new ApiResponse(
                "Subscriptions deactivated successfully!", true
        ));
    }

    @GetMapping("/user/active")
    public ResponseEntity<?> getUsersActiveSubscription(@RequestParam(required = false) Long userId) throws Exception {
        SubscriptionDTO subscriptionDTO = subscriptionService.
                getUsersActiveSubscription(userId);

        return ResponseEntity.ok(subscriptionDTO);
    }
}
