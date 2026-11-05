package com.sanket.library_management_system.payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetTokenRequest {
    @NotNull(message = "Token is required!")
    private String token;
    @NotNull(message = "Password is required!")
    private String password;
}
