package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.mapper.UserMapper;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.dto.UserDTO;
import com.sanket.library_management_system.repository.UserRepository;
import com.sanket.library_management_system.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    @Autowired
    private final UserRepository userRepository;

    @Override
    public User getCurrentUser() throws UserException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);

        if(user == null){
            throw new UserException("User not found!");
        }

        return user;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();

        return UserMapper.toDTOList(users);
    }
}
