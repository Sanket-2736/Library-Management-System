package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.dto.UserDTO;
import com.sanket.library_management_system.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private final UserService userService;

    @GetMapping("/list")
    public ResponseEntity<List<UserDTO>> getAllUsers(){
        try {
            log.info("Fetching all users");
            List<UserDTO> users = userService.getAllUsers();
            log.info("Successfully fetched {} users", users.size());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Failed to fetch all users, Error: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUser() throws UserException {
        try {
            log.info("Fetching current user profile");
            User user = userService.getCurrentUser();
            log.info("Current user profile fetched: {}", user.getEmail());
            return ResponseEntity.ok(user);
        } catch (UserException e) {
            log.error("Failed to fetch current user profile, Error: {}", e.getMessage(), e);
            throw e;
        }
    }
}
