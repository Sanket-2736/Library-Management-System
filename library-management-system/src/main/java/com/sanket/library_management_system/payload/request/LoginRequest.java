package com.sanket.library_management_system.payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginRequest {
    @NotNull(message = "Email is required!")
    private String email;
    @NotNull(message = "Password is required!")
    private String password;
}
