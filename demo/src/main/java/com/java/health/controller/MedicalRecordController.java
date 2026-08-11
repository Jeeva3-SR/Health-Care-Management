package com.java.health.controller;

import com.java.health.dto.MedicalRecordRequest;
import com.java.health.entity.Doctor;
import com.java.health.entity.MedicalRecord;
import com.java.health.entity.Patients;
import com.java.health.entity.User;
import com.java.health.repository.DoctorRepository;
import com.java.health.repository.MedicalRecordRepository;
import com.java.health.repository.PatientRepository;
import com.java.health.repository.UserRepository;
import com.java.health.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private final MedicalRecordRepository medicalRecordRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final NotificationService notificationService;

    public MedicalRecordController(MedicalRecordRepository medicalRecordRepository, UserRepository userRepository, DoctorRepository doctorRepository, PatientRepository patientRepository, NotificationService notificationService) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.notificationService = notificationService;
    }

    private String getUsername(Principal principal) {
        if (principal != null && StringUtils.hasText(principal.getName())) {
            return principal.getName();
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            return auth.getName();
        }
        return null;
    }

    @GetMapping("/patient")
    public ResponseEntity<List<MedicalRecord>> getPatientRecords(Principal principal) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.ok(Collections.emptyList());

        return ResponseEntity.ok(medicalRecordRepository.findByPatient_User_IdOrderByCreatedAtDesc(user.getId()));
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<MedicalRecord>> getDoctorRecords(Principal principal) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.ok(Collections.emptyList());

        return ResponseEntity.ok(medicalRecordRepository.findByDoctor_User_IdOrderByCreatedAtDesc(user.getId()));
    }

    @PostMapping
    public ResponseEntity<MedicalRecord> createMedicalRecord(@RequestBody MedicalRecordRequest request, Principal principal) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User doctorUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Doctor user not found"));

        Doctor doctor = doctorRepository.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getId().equals(doctorUser.getId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found"));

        Patients patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found with ID: " + request.getPatientId()));

        MedicalRecord record = new MedicalRecord();
        record.setDoctor(doctor);
        record.setPatient(patient);
        record.setDiagnosis(request.getDiagnosis());
        record.setTreatment(request.getTreatment());
        record.setDoctorNotes(request.getDoctorNotes());
        record.setPrescription(request.getPrescription());
        record.setRecordDate(LocalDate.now());
        record.setCreatedAt(LocalDateTime.now());

        MedicalRecord saved = medicalRecordRepository.save(record);

        // Notify patient
        if (patient.getUser() != null) {
            notificationService.createNotification(
                    patient.getUser(),
                    "New Medical Record Added",
                    "Dr. " + doctor.getName() + " added a new medical record for your recent consultation.",
                    "MEDICAL_RECORD"
            );
        }

        return ResponseEntity.ok(saved);
    }
}
