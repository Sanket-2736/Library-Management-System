package com.sanket.library_management_system.repository;

import com.sanket.library_management_system.model.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionPlanRepository
        extends JpaRepository<SubscriptionPlan, Long> {

    Optional<SubscriptionPlan> findByPlanCode(String planCode);

    boolean existsByPlanCode(String planCode);
}