package com.sanket.library_management_system.mapper;

import com.sanket.library_management_system.domain.UserRole;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.dto.UserDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserMapper {
    public static UserDTO toDTO(User user) {

        if (user == null) {
            return null;
        }

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .phone(user.getPhone())
                .profileImage(user.getProfileImage())
                .lastLogin(user.getLastLogin())
                .password(null)
                .build();
    }

    public static User toEntity(UserDTO userDTO) {

        if (userDTO == null) {
            return null;
        }

        return User.builder()
                .id(userDTO.getId())
                .email(userDTO.getEmail())
                .fullName(userDTO.getFullName())
                .role(userDTO.getRole() != null
                        ? UserRole.valueOf(userDTO.getRole())
                        : null)
                .phone(userDTO.getPhone())
                .profileImage(userDTO.getProfileImage())
                .password(userDTO.getPassword())
                .build();
    }

    public static List<UserDTO> toDTOList(List<User> users){
        return users.stream()
                .map(UserMapper::toDTO)
                .toList();
    }

    public static Set<UserDTO> toDTOSett(List<User> users){
        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toSet());
    }
}