package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.EmailException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.payload.dto.UserDTO;
import com.sanket.library_management_system.payload.request.ForgetPasswordRequest;
import com.sanket.library_management_system.payload.request.LoginRequest;
import com.sanket.library_management_system.payload.response.AuthResponse;
import com.sanket.library_management_system.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid LoginRequest request
            ) throws UserException {
        String username = request.getEmail();;
        String password = request.getPassword();
        AuthResponse response = authService.login(username, password);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @RequestBody @Valid UserDTO req
    ) throws UserException {

        AuthResponse response = authService.signup(req);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody @Valid ForgetPasswordRequest request
            ) throws UserException, EmailException {

        authService.createPasswordResetToken(request.getEmail());

        return ResponseEntity.ok(
                "Password reset link has been sent to your email."
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) throws Exception {

        authService.resetPassword(token, newPassword);

        return ResponseEntity.ok("Password reset successfully.");
    }
}