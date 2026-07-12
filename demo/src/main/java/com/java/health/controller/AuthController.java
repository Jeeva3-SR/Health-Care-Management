package com.java.health.controller;

import com.java.health.dto.LoginRequest;
import com.java.health.dto.PatientRegisterRequest;
import com.java.health.dto.DoctorRegisterRequest; // Create this DTO for doctor input + file
import com.java.health.dto.PasswordChangeRequest; // Create this DTO for changing password
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.java.health.service.AuthService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/patient")
    public ResponseEntity<?> registerUser(@RequestBody PatientRegisterRequest signUpRequest) {
        return authService.register(signUpRequest);

    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest passwordChangeRequest) {
        return authService.changePassword(passwordChangeRequest);
    }
}