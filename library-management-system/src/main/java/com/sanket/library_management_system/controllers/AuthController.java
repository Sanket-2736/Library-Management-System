package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.EmailException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.payload.dto.UserDTO;
import com.sanket.library_management_system.payload.request.ForgetPasswordRequest;
import com.sanket.library_management_system.payload.request.LoginRequest;
import com.sanket.library_management_system.payload.request.ResetTokenRequest;
import com.sanket.library_management_system.payload.response.ApiResponse;
import com.sanket.library_management_system.payload.response.AuthResponse;
import com.sanket.library_management_system.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid LoginRequest request
            ) throws UserException {
        try {
            log.info("Login attempt for email: {}", request.getEmail());
            String username = request.getEmail();;
            String password = request.getPassword();
            AuthResponse response = authService.login(username, password);
            log.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (UserException e) {
            log.error("Login failed for email: {}, Error: {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @RequestBody @Valid UserDTO req
    ) throws UserException {
        try {
            log.info("Signup attempt for email: {}, fullName: {}", req.getEmail(), req.getFullName());
            AuthResponse response = authService.signup(req);
            log.info("Signup successful for email: {}", req.getEmail());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (UserException e) {
            log.error("Signup failed for email: {}, Error: {}", req.getEmail(), e.getMessage());
            throw e;
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(
            @RequestBody @Valid ForgetPasswordRequest request
            ) throws UserException, EmailException {
        try {
            log.info("Forgot password request for email: {}", request.getEmail());
            authService.createPasswordResetToken(request.getEmail());
            log.info("Password reset email sent successfully to: {}", request.getEmail());
            return ResponseEntity.ok(new ApiResponse("Password reset link is sent to your inbox.", true));
        } catch (UserException | EmailException e) {
            log.error("Forgot password failed for email: {}, Error: {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody @Valid ResetTokenRequest request
            ) throws Exception {
        try {
            log.info("Password reset attempt initiated");
            authService.resetPassword(request.getToken(), request.getPassword());
            log.info("Password reset completed successfully");
            return ResponseEntity.ok(new ApiResponse("Password reset successfully.", true));
        } catch (Exception e) {
            log.error("Password reset failed, Error: {}", e.getMessage(), e);
            throw e;
        }
    }
}