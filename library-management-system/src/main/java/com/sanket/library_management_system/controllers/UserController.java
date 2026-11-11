
package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.dto.UserDTO;
import com.sanket.library_management_system.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private final UserService userService;

    @GetMapping("/list")
    public ResponseEntity<List<UserDTO>> getAllUsers() {

        log.info("Received request to fetch all users");

        List<UserDTO> users = userService.getAllUsers();

        log.info("Successfully fetched {} users", users.size());

        return ResponseEntity.ok(users);
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUser() throws UserException {

        log.info("Received request to fetch current user's profile");

        User user = userService.getCurrentUser();

        log.info("Successfully fetched current user's profile");

        return ResponseEntity.ok(user);
    }
}
