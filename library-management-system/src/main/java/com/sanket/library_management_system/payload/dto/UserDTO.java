package com.sanket.library_management_system.payload.dto;

import com.sanket.library_management_system.domain.AuthProvider;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    @NotNull(message = "Email is required!")
    private String email;
    @NotNull(message = "Full Name is required!")
    private String fullName;
    private String role;
    private String phone;
    private String profileImage;
    private LocalDateTime lastLogin;

    @NotNull(message = "Password is required!")
    private String password;
}
