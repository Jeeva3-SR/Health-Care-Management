package com.java.health.controller;

import com.java.health.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/admin/doctors")
public class AdminController {

    @Autowired
    private DoctorService doctorService;

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveDoctor(@PathVariable Long id) {
        doctorService.approveDoctor(id);
        return ResponseEntity.ok("Doctor account verified. Access credentials have been sent out via email.");
    }
}