package com.java.health.service;

import com.java.health.config.JwtUtil;
import lombok.Builder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.java.health.dto.LoginRequest;
import com.java.health.dto.PatientRegisterRequest;
import com.java.health.dto.PasswordChangeRequest;
import com.java.health.entity.User;
import com.java.health.entity.Role;
import com.java.health.entity.AccountStatus;
import com.java.health.repository.UserRepository;
import com.java.health.dto.JwtResponse;
import lombok.RequiredArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Service
@RequiredArgsConstructor
@Getter
@Setter
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    /**
     * Public Patient/User Registration Flow
     */
    public ResponseEntity<?> register(PatientRegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        // Restrict this endpoint from creating Admin or Doctor accounts directly
        Role userRole = switch (request.getRole().toUpperCase()) {
            case "ADMIN" -> Role.ADMIN;
            default -> Role.PATIENT;
        };

        User user = User.builder()
                .username(request.getUsername())
                .password(encoder.encode(request.getPassword()))
                .role(userRole)// Standard users set their own password initially
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    /**
     * Unified Login Flow (Handles Patients, Admins, and Approved Doctors)
     */
    public ResponseEntity<?> login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateJwtToken(authentication);

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();



        // Return updated structure incorporating isFirstLogin
        return ResponseEntity.ok(new JwtResponse(jwt, user.getUsername(), user.getRole().name()));
    }

    /**
     * Secured Password Change Flow
     */
    public ResponseEntity<?> changePassword(PasswordChangeRequest request) {
        // Safe context retrieval using Spring Security
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Logged in user context missing from DB."));

        // Match input raw password with hashed DB entry
        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Error: Current password verification failed.");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully. Account setup finished.");
    }
}