
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

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid LoginRequest request
    ) throws UserException {

        String username = request.getEmail();

        log.info("Login request received for email: {}", username);

        String password = request.getPassword();
        AuthResponse response = authService.login(username, password);

        log.info("User logged in successfully: {}", username);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @RequestBody @Valid UserDTO req
    ) throws UserException {

        log.info("Signup request received");

        AuthResponse response = authService.signup(req);

        log.info("User signup completed successfully");

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(
            @RequestBody @Valid ForgetPasswordRequest request
    ) throws UserException, EmailException {

        log.info("Password reset request received for email: {}", request.getEmail());

        authService.createPasswordResetToken(request.getEmail());

        log.info("Password reset link generated and sent successfully for email: {}", request.getEmail());

        return ResponseEntity.ok(new ApiResponse("Password reset link is sent to your inbox.", true));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody @Valid ResetTokenRequest request
    ) throws Exception {

        log.info("Password reset execution request received");

        authService.resetPassword(request.getToken(), request.getPassword());

        log.info("Password reset completed successfully");

        return ResponseEntity.ok(new ApiResponse("Password reset successfully.", true));
    }
}
