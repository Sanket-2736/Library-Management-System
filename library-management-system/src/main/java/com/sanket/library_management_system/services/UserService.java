package com.sanket.library_management_system.services;

import com.sanket.library_management_system.exception.UserException;
import com.sanket.library_management_system.model.User;
import com.sanket.library_management_system.payload.dto.UserDTO;

import java.util.List;

public interface UserService {
    public User getCurrentUser() throws UserException;
    public List<UserDTO> getAllUsers();
}
