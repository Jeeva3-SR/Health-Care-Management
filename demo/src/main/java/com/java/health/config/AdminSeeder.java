package com.java.health.config;

import com.java.health.entity.Role;
import com.java.health.entity.User;
import com.java.health.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        String adminUsername = "admin@gmail.com";

        if (!userRepository.existsByUsername(adminUsername)) {

            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("--------------------------------");
            System.out.println("Admin account created");
            System.out.println("Username : admin");
            System.out.println("Password : Admin@123");
            System.out.println("--------------------------------");
        }
    }
}