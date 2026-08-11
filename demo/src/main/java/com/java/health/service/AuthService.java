package com.java.health.service;

import com.java.health.config.JwtUtil;
import com.java.health.dto.JwtResponse;
import com.java.health.dto.LoginRequest;
import com.java.health.dto.PasswordChangeRequest;
import com.java.health.dto.PatientRegisterRequest;
import com.java.health.entity.Patients;
import com.java.health.entity.Role;
import com.java.health.entity.User;
import com.java.health.repository.PatientRepository;
import com.java.health.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PatientRepository patientRepository, PasswordEncoder encoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public ResponseEntity<?> register(PatientRegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        Role userRole = Role.PATIENT;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            userRole = Role.ADMIN;
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(encoder.encode(request.getPassword()))
                .role(userRole)
                .requiresPasswordChange(false)
                .build();

        User savedUser = userRepository.save(user);

        if (userRole == Role.PATIENT) {
            Patients patient = new Patients();
            patient.setName(request.getFullName());
            patient.setPhone(request.getPhone());
            patient.setAge(request.getAge());
            patient.setGender(request.getGender());
            patient.setBloodGroup(request.getBloodGroup());
            patient.setEmergencyContact(request.getEmergencyContact());
            patient.setChronicConditions(request.getChronicConditions());
            patient.setUser(savedUser);
            patientRepository.save(patient);
        }

        return ResponseEntity.ok("User registered successfully!");
    }

    public ResponseEntity<?> login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateJwtToken(authentication);

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();

        // Pass requiresPasswordChange back in response body for frontend to redirect if true
        // (Could add it to JwtResponse object, or add custom claims to JWT)
        return ResponseEntity.ok(new JwtResponse(jwt, user.getUsername(), user.getRole().name(), user.isRequiresPasswordChange()));
    }

    public ResponseEntity<?> changePassword(PasswordChangeRequest request) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Logged in user context missing from DB."));

        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Error: Current password verification failed.");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setRequiresPasswordChange(false);
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully.");
    }

    public ResponseEntity<?> getProfile() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Logged in user context missing from DB."));
        return ResponseEntity.ok(user);
    }
}