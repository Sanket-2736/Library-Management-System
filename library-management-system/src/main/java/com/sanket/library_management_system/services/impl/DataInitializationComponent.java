package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.domain.UserRole;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializationComponent implements CommandLineRunner {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args){
        initializeAdminUser();
    }

    private void initializeAdminUser(){
        String adminEmail="admin@lms.com";

        if(userRepository.findByEmail(adminEmail) == null){
            User user = User.builder()
                    .fullName("Admin Library Management System")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin@lms123"))
                    .role(UserRole.ROLE_ADMIN)
                    .build();

            User admin = userRepository.save(user);
        }
    }
}
