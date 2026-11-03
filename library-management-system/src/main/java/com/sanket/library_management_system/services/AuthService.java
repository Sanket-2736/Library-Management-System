package com.sanket.library_management_system.services;

import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.payload.dto.UserDTO;
import com.sanket.library_management_system.payload.response.AuthResponse;

public interface AuthService {
    AuthResponse login(String username, String password);
    AuthResponse signup(UserDTO req) throws UserException;
    void createPasswordResetToken(String email);
    void resetPassword(String password, String newPassword);
}
