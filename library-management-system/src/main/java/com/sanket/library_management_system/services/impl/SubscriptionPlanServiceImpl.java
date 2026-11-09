
package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.exception.SubscriptionPlanException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.mapper.SubscriptionPlanMapper;
import com.sanket.library_management_system.model.SubscriptionPlan;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.dto.SubscriptionPlanDTO;
import com.sanket.library_management_system.repository.SubscriptionPlanRepository;
import com.sanket.library_management_system.repository.UserRepository;
import com.sanket.library_management_system.services.SubscriptionPlanService;

import com.sanket.library_management_system.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    private User getCurrentUser() throws UserException {
        return userService.getCurrentUser();
    }

    @Override
    public SubscriptionPlanDTO getSubscriptionPlan(Long id)
            throws SubscriptionPlanException {

        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new SubscriptionPlanException("Plan not found!"));

        return SubscriptionPlanMapper.toDto(plan);
    }

    @Override
    public SubscriptionPlanDTO createSubscriptionPlan(SubscriptionPlanDTO dto) throws SubscriptionPlanException, UserException {

        if(subscriptionPlanRepository.existsByPlanCode(dto.getPlanCode())){
            throw new SubscriptionPlanException("Plan already exists!");
        }

        SubscriptionPlan plan = SubscriptionPlanMapper.toEntity(dto);

        User currentUser = getCurrentUser();

        // Ensure a new record is created
        plan.setId(null);
        plan.setCreatedBy(currentUser.getFullName());;
        plan.setUpdatedBy(currentUser.getFullName());;

        SubscriptionPlan savedPlan = subscriptionPlanRepository.save(plan);

        return SubscriptionPlanMapper.toDto(savedPlan);
    }

    @Override
    public SubscriptionPlanDTO updateSubscriptionPlan(Long id, SubscriptionPlanDTO dto) throws SubscriptionPlanException, UserException {

        SubscriptionPlan existingPlan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new SubscriptionPlanException("Plan not found!"));

        SubscriptionPlanMapper.updateEntity(dto, existingPlan);

        User currentUser = getCurrentUser();


        existingPlan.setUpdatedBy(currentUser.getFullName());;

        SubscriptionPlan updatedPlan = subscriptionPlanRepository.save(existingPlan);

        return SubscriptionPlanMapper.toDto(updatedPlan);
    }

    @Override
    public void deleteSubscriptionPlan(Long id) throws SubscriptionPlanException {

        SubscriptionPlan subscriptionPlan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new SubscriptionPlanException("Plan not found!"));

        // Soft delete
        subscriptionPlan.setIsActive(false);

        subscriptionPlanRepository.save(subscriptionPlan);
    }

    @Override
    public void hardDeleteSubscriptionPlan(Long id) throws SubscriptionPlanException {

        SubscriptionPlan subscriptionPlan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new SubscriptionPlanException("Plan not found!"));

        subscriptionPlanRepository.delete(subscriptionPlan);
    }

    @Override
    public List<SubscriptionPlanDTO> getAllSubscriptionPlans() {

        List<SubscriptionPlan> plans = subscriptionPlanRepository.findAll();

        return SubscriptionPlanMapper.toDtoList(plans);
    }
}
