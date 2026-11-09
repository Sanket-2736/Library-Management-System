package com.sanket.library_management_system.controllers;

import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.dto.UserDTO;
import com.sanket.library_management_system.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private final UserService userService;

    @GetMapping("/list")
    public ResponseEntity<List<UserDTO>> getAllUsers(){
        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUser() throws UserException {
        return ResponseEntity.ok(
                userService.getCurrentUser()
        );
    }
}
