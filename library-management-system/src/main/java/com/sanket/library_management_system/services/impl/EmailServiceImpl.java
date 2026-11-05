
package com.sanket.library_management_system.services.impl;

import com.sanket.library_management_system.exception.EmailException;
import com.sanket.library_management_system.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendEmail(String to, String subject, String body)
            throws EmailException {

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(mimeMessage);

        } catch (MailException | MessagingException e) {
            e.printStackTrace();
            throw new EmailException("Failed to send email: " + e.getMessage());
        }
    }
}
