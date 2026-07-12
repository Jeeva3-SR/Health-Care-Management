package com.java.health.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendCredentials(String toEmail, String name, String username, String rawPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your Doctor Portal Account Has Been Approved!");

        String emailBody = String.format(
                "Hello Dr. %s,\n\n" +
                        "Your registration request has been approved by the admin.\n" +
                        "You can now log into your portal using the credentials below:\n\n" +
                        "Username: %s\n" +
                        "Temporary Password: %s\n\n" +
                        "Please change your password immediately upon your first login.\n\n" +
                        "Regards,\nMedical Center Admin Team",
                name, username, rawPassword
        );

        message.setText(emailBody);
        mailSender.send(message);
    }
}