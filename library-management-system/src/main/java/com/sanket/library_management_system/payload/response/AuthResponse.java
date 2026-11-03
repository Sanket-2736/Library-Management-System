package com.sanket.library_management_system.payload.response;

import com.sanket.library_management_system.payload.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String jwt;
    private String title;
    private String message;
    private UserDTO user;
}
