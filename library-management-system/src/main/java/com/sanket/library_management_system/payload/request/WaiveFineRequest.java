package com.sanket.library_management_system.payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WaiveFineRequest {

    @NotNull(message = "Fine ID is required!")
    private Long fineId;

    @NotNull(message = "Reason is required!")
    private String reason;
}
