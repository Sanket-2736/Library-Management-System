package com.sanket.library_management_system.services;

import com.sanket.library_management_system.exception.EmailException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.payload.dto.UserDTO;
import com.sanket.library_management_system.payload.response.AuthResponse;

public interface AuthService {
    AuthResponse login(String username, String password) throws UserException;
    AuthResponse signup(UserDTO req) throws UserException;
    void createPasswordResetToken(String email) throws UserException, EmailException;
    void resetPassword(String password, String newPassword) throws Exception;
}
