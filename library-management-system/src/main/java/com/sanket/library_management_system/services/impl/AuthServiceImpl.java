package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.domain.UserRole;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.dto.UserDTO;
import com.sanket.library_management_system.payload.response.AuthResponse;
import com.sanket.library_management_system.repository.UserRepository;
import com.sanket.library_management_system.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(String username, String password) {
        return null;
    }

    @Override
    public AuthResponse signup(UserDTO req) throws UserException {
        User user = userRepository.findByEmail(req.getEmail());

        if(user != null){
            throw new UserException("User with this email already exists!");
        }

        User created = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .fullName(req.getFullName())
                .lastLogin(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .role(UserRole.ROLE_USER)
                .build();

        User saved = userRepository.save(created);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                saved.getEmail(),
                saved.getPassword()
        );

        return null;
    }

    @Override
    public void createPasswordResetToken(String email) {

    }

    @Override
    public void resetPassword(String password, String newPassword) {

    }
}
