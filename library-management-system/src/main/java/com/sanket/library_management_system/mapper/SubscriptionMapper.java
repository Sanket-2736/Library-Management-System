
package com.sanket.library_management_system.mapper;

import com.sanket.library_management_system.exception.SubscriptionPlanException;
import com.sanket.library_management_system.model.Subscription;
import com.sanket.library_management_system.model.SubscriptionPlan;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.dto.SubscriptionDTO;
import com.sanket.library_management_system.repository.SubscriptionPlanRepository;
import com.sanket.library_management_system.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class SubscriptionMapper {

    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final UserRepository userRepository;

    // Convert SubscriptionPlan to SubscriptionDTO
    public SubscriptionDTO toDTO(SubscriptionPlan plan) {

        if (plan == null) {
            return null;
        }

        return SubscriptionDTO.builder()
                .id(plan.getId())
                .name(plan.getName())
                .planCode(plan.getPlanCode())
                .description(plan.getDescription())
                .price(plan.getPrice())
                .currencyCode(plan.getCurrencyCode())
                .durationDays(plan.getDurationDays())
                .maxBooksAllowed(plan.getMaxBooksAllowed())
                .maxDaysPerBook(plan.getMaxDaysPerBook())
                .isActive(plan.getIsActive())
                .isFeatured(plan.getIsFeatured())
                .badgeText(plan.getBadgeText())
                .displayOrder(plan.getDisplayOrder())
                .priceInMajorUnits(toMajorUnits(plan.getPrice()))
                .monthlyEquivalentPrice(
                        calculateMonthlyEquivalent(
                                plan.getPrice(),
                                plan.getDurationDays()
                        )
                )
                .adminNotes(plan.getAdminNotes())
                .build();
    }

    // Convert Subscription entity to SubscriptionDTO
    public SubscriptionDTO toDTO(Subscription subscription) {

        if (subscription == null) {
            return null;
        }

        Integer durationDays = null;

        if (subscription.getStartDate() != null &&
                subscription.getEndDate() != null) {

            durationDays = (int) ChronoUnit.DAYS.between(
                    subscription.getStartDate(),
                    subscription.getEndDate()
            );
        }

        return SubscriptionDTO.builder()
                .id(subscription.getId())
                .name(subscription.getPlanName())
                .planCode(subscription.getPlanCode())
                .price(subscription.getPrice())
                .currencyCode(
                        subscription.getPlan() != null
                                ? subscription.getPlan().getCurrencyCode()
                                : "INR"
                )
                .durationDays(durationDays)
                .maxBooksAllowed(subscription.getMaxBooksAllowed())
                .maxDaysPerBook(subscription.getMaxDaysPerBook())
                .isActive(subscription.getIsActive())
                .priceInMajorUnits(toMajorUnits(subscription.getPrice()))
                .monthlyEquivalentPrice(
                        calculateMonthlyEquivalent(
                                subscription.getPrice(),
                                durationDays
                        )
                )
                .build();
    }

    // Convert SubscriptionDTO to Subscription entity
    public Subscription toEntity(SubscriptionDTO dto) throws SubscriptionPlanException {

        if (dto == null) {
            return null;
        }

        // Get authenticated user
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            throw new IllegalStateException("User is not authenticated!");
        }

        String email = authentication.getName();

        // Find user
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new IllegalStateException("User not found!");
        }

        // Find subscription plan
        SubscriptionPlan plan = subscriptionPlanRepository
                .findById(dto.getId())
                .orElseThrow(() ->
                        new SubscriptionPlanException(
                                "Subscription plan not found!"
                        )
                );

        // Create subscription
        Subscription subscription = Subscription.builder()
                .user(user)
                .plan(plan)
                .startDate(LocalDate.now())
                .isActive(true)
                .build();

        // Initialize subscription details from plan
        subscription.initializeFromPlan();

        return subscription;
    }

    // Convert paise to rupees
    private Double toMajorUnits(Long price) {

        if (price == null) {
            return null;
        }

        return price / 100.0;
    }

    // Calculate approximate monthly equivalent
    private Double calculateMonthlyEquivalent(
            Long price,
            Integer durationDays
    ) {

        if (price == null || durationDays == null || durationDays <= 0) {
            return null;
        }

        return (price / 100.0) * 30.0 / durationDays;
    }
}
