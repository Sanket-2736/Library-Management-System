package com.sanket.library_management_system.services;

import com.sanket.library_management_system.exception.EmailException;

public interface EmailService {
    void sendEmail(String to, String subject, String body) throws EmailException;
}
