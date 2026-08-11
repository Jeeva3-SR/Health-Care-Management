package com.java.health.controller;

import com.java.health.dto.PrescriptionDTO;
import com.java.health.entity.Doctor;
import com.java.health.entity.Patients;
import com.java.health.entity.Prescription;
import com.java.health.entity.User;
import com.java.health.repository.DoctorRepository;
import com.java.health.repository.PatientRepository;
import com.java.health.repository.PrescriptionRepository;
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
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final NotificationService notificationService;

    public PrescriptionController(PrescriptionRepository prescriptionRepository, UserRepository userRepository, DoctorRepository doctorRepository, PatientRepository patientRepository, NotificationService notificationService) {
        this.prescriptionRepository = prescriptionRepository;
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
    public ResponseEntity<List<Prescription>> getPatientPrescriptions(Principal principal) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.ok(Collections.emptyList());

        return ResponseEntity.ok(prescriptionRepository.findByPatient_User_IdOrderByCreatedAtDesc(user.getId()));
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<Prescription>> getDoctorPrescriptions(Principal principal) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.ok(Collections.emptyList());

        return ResponseEntity.ok(prescriptionRepository.findByDoctor_User_IdOrderByCreatedAtDesc(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody PrescriptionDTO dto, Principal principal) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User doctorUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Doctor user not found"));

        Doctor doctor = doctorRepository.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getId().equals(doctorUser.getId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found"));

        Patients patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found with ID: " + dto.getPatientId()));

        Prescription prescription = new Prescription();
        prescription.setDoctor(doctor);
        prescription.setPatient(patient);
        prescription.setMedication(dto.getMedication());
        prescription.setDosage(dto.getDosage());
        prescription.setFrequency(dto.getFrequency());
        prescription.setDuration(dto.getDuration());
        prescription.setInstructions(dto.getInstructions());
        prescription.setPrescribedDate(LocalDate.now());
        prescription.setStatus("ACTIVE");
        prescription.setCreatedAt(LocalDateTime.now());

        Prescription saved = prescriptionRepository.save(prescription);

        // Notify patient
        if (patient.getUser() != null) {
            notificationService.createNotification(
                    patient.getUser(),
                    "New Prescription Issued",
                    "Dr. " + doctor.getName() + " issued a new prescription for " + dto.getMedication() + ".",
                    "PRESCRIPTION"
            );
        }

        return ResponseEntity.ok(saved);
    }
}
