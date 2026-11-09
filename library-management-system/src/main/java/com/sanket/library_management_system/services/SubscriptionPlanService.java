package com.sanket.library_management_system.services;

import com.sanket.library_management_system.exception.SubscriptionPlanException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.model.SubscriptionPlan;
import com.sanket.library_management_system.payload.dto.SubscriptionPlanDTO;

import java.util.List;

public interface SubscriptionPlanService {
    SubscriptionPlanDTO getSubscriptionPlan(Long subscriptionPlanId) throws SubscriptionPlanException;
    SubscriptionPlanDTO createSubscriptionPlan(SubscriptionPlanDTO dto) throws SubscriptionPlanException, UserException;
    SubscriptionPlanDTO updateSubscriptionPlan(Long id, SubscriptionPlanDTO dto) throws SubscriptionPlanException, UserException;
    void deleteSubscriptionPlan(Long id) throws SubscriptionPlanException;
    void hardDeleteSubscriptionPlan(Long id) throws SubscriptionPlanException;
    List<SubscriptionPlanDTO> getAllSubscriptionPlans();
    SubscriptionPlan getBySubscriptionPlanCode(String planCode) throws SubscriptionPlanException;
}
