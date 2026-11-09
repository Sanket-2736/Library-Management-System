
package com.sanket.library_management_system.mapper;

import com.sanket.library_management_system.model.SubscriptionPlan;
import com.sanket.library_management_system.payload.dto.SubscriptionPlanDTO;

import java.util.List;

public class SubscriptionPlanMapper {

    public static SubscriptionPlanDTO toDto(SubscriptionPlan plan) {

        if (plan == null) {
            return null;
        }

        SubscriptionPlanDTO dto = new SubscriptionPlanDTO();

        dto.setId(plan.getId());
        dto.setPlanCode(plan.getPlanCode());
        dto.setName(plan.getName());
        dto.setDescription(plan.getDescription());
        dto.setDurationDays(plan.getDurationDays());
        dto.setPrice(plan.getPrice());
        dto.setCurrencyCode(plan.getCurrencyCode());
        dto.setMaxBooksAllowed(plan.getMaxBooksAllowed());
        dto.setMaxDaysPerBook(plan.getMaxDaysPerBook());
        dto.setDisplayOrder(plan.getDisplayOrder());
        dto.setIsActive(plan.getIsActive());
        dto.setIsFeatured(plan.getIsFeatured());
        dto.setBadgeText(plan.getBadgeText());
        dto.setAdminNotes(plan.getAdminNotes());
        dto.setCreatedAt(plan.getCreatedAt());
        dto.setUpdatedAt(plan.getUpdatedAt());
        dto.setUpdatedBy(plan.getUpdatedBy());
        dto.setCreatedBy(plan.getCreatedBy());

        return dto;
    }

    public static void updateEntity(SubscriptionPlanDTO dto, SubscriptionPlan entity) {

        if (dto == null || entity == null) {
            return;
        }

        if (dto.getPlanCode() != null)
            entity.setPlanCode(dto.getPlanCode());

        if (dto.getName() != null)
            entity.setName(dto.getName());

        if (dto.getDescription() != null)
            entity.setDescription(dto.getDescription());

        if (dto.getDurationDays() != null)
            entity.setDurationDays(dto.getDurationDays());

        if (dto.getPrice() != null)
            entity.setPrice(dto.getPrice());

        if (dto.getCurrencyCode() != null)
            entity.setCurrencyCode(dto.getCurrencyCode());

        if (dto.getMaxBooksAllowed() != null)
            entity.setMaxBooksAllowed(dto.getMaxBooksAllowed());

        if (dto.getMaxDaysPerBook() != null)
            entity.setMaxDaysPerBook(dto.getMaxDaysPerBook());

        if (dto.getDisplayOrder() != null)
            entity.setDisplayOrder(dto.getDisplayOrder());

        if (dto.getIsActive() != null)
            entity.setIsActive(dto.getIsActive());

        if (dto.getIsFeatured() != null)
            entity.setIsFeatured(dto.getIsFeatured());

        if (dto.getBadgeText() != null)
            entity.setBadgeText(dto.getBadgeText());

        if (dto.getAdminNotes() != null)
            entity.setAdminNotes(dto.getAdminNotes());

        if (dto.getUpdatedBy() != null)
            entity.setUpdatedBy(dto.getUpdatedBy());
    }

    public static SubscriptionPlan toEntity(SubscriptionPlanDTO dto) {

        if (dto == null) {
            return null;
        }

        return SubscriptionPlan.builder()
                .id(dto.getId())
                .planCode(dto.getPlanCode())
                .name(dto.getName())
                .description(dto.getDescription())
                .durationDays(dto.getDurationDays())
                .price(dto.getPrice())
                .currencyCode(dto.getCurrencyCode())
                .maxBooksAllowed(dto.getMaxBooksAllowed())
                .maxDaysPerBook(dto.getMaxDaysPerBook())
                .displayOrder(dto.getDisplayOrder())
                .isActive(dto.getIsActive())
                .isFeatured(dto.getIsFeatured())
                .badgeText(dto.getBadgeText())
                .adminNotes(dto.getAdminNotes())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .updatedBy(dto.getUpdatedBy())
                .createdBy(dto.getCreatedBy())
                .build();
    }

    public static List<SubscriptionPlanDTO> toDtoList(
            List<SubscriptionPlan> plans) {

        if (plans == null) {
            return List.of();
        }

        return plans.stream()
                .map(SubscriptionPlanMapper::toDto)
                .toList();
    }
}
