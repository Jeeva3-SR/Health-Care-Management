package com.java.health.controller;

import com.java.health.dto.DoctorRegisterRequest;
import com.java.health.entity.Doctor;
import java.util.*;
import com.java.health.repository.DoctorRepository;
import com.java.health.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/doctors")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;
    private final DoctorRepository doctorRepository;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> registerDoctor(@ModelAttribute DoctorRegisterRequest request) {
        doctorService.registerDoctor(request);
        return new ResponseEntity<>("Registration submitted for verification.", HttpStatus.CREATED);
    }

    @GetMapping("/pending-doctors")
    public ResponseEntity<List<Doctor>> getPendingDoctors() {
        return ResponseEntity.ok(
                doctorService.getPendingDoctors()
        );
    }

    @GetMapping("/all-doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return ResponseEntity.ok(doctors);
    }
}