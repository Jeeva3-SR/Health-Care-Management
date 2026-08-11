package com.java.health.controller;

import com.java.health.dto.LoginRequest;
import com.java.health.dto.PasswordChangeRequest;
import com.java.health.dto.PatientRegisterRequest;
import com.java.health.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

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

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        return authService.getProfile();
    }
}