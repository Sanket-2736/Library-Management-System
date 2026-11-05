package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.configurations.JwtProvider;
import com.sanket.library_management_system.domain.UserRole;
import com.sanket.library_management_system.exception.EmailException;
import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.mapper.UserMapper;
import com.sanket.library_management_system.model.PasswordResetToken;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.dto.UserDTO;
import com.sanket.library_management_system.payload.response.AuthResponse;
import com.sanket.library_management_system.repository.PasswordResetTokenRepository;
import com.sanket.library_management_system.repository.UserRepository;
import com.sanket.library_management_system.services.AuthService;
import com.sanket.library_management_system.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final JwtProvider jwtProvider;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private final UserMapper userMapper;

    @Autowired
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private final CustomUserServiceImplementation customUserServiceImplementation;

    @Autowired
    private final EmailService emailService;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public AuthResponse login(String username, String password) throws UserException {
        Authentication auth = authenticate(username, password);

        User user = userRepository.findByEmail(username);

        if(user == null){
            throw new UserException("User with the provided credentials not found!");
        }

        SecurityContextHolder.getContext().setAuthentication(auth);
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        String role = authorities.iterator().next().getAuthority();
        String jwt = jwtProvider.generateToken(auth);

        user.setLastLogin(LocalDateTime.now());

        userRepository.save(user);

        return AuthResponse.builder()
                .jwt(jwt)
                .title("Welcome back " + user.getFullName())
                .message("Login successful!")
                .user(UserMapper.toDTO(user))
                .build();
    }
    private Authentication authenticate(String username, String password) throws UserException {
        UserDetails userDetails = customUserServiceImplementation.loadUserByUsername(username);

        if(userDetails == null){
            throw new UserException("User not found!");
        }

        if(!passwordEncoder.matches(password, userDetails.getPassword())){
            throw new UserException("Inavalid credentials! Recheck the username or password!");
        }

        return new UsernamePasswordAuthenticationToken(
                username, null, userDetails.getAuthorities()
        );
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

        Authentication auth = new UsernamePasswordAuthenticationToken(
                saved.getEmail(),
                saved.getPassword()
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = jwtProvider.generateToken(auth);

        return AuthResponse.builder()
                .jwt(jwt)
                .title("Welcome " + created.getFullName())
                .message("Registration successful!")
                .user(UserMapper.toDTO(saved))
                .build();
    }

    @Override
    @Transactional
    public void createPasswordResetToken(String email) throws UserException, EmailException {
        User user = userRepository.findByEmail(email);

        if(user == null){
            throw new UserException("User not found!");
        }

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(5))
                .build();

        passwordResetTokenRepository.save(resetToken);

        String resetLink = frontendUrl + token;

        String subject = "Password reset request";

        String body = "You requested to reset your password. Use this link(valid upto 5 minutes): " + resetLink;

        emailService.sendEmail(user.getEmail(), subject, body);


    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) throws Exception {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new UserException("Token not valid!"));

        if(resetToken.isExpired()){
            passwordResetTokenRepository.delete(resetToken);
            throw new Exception("Token expired!");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);
    }
}
