package com.java.health.controller;

import com.java.health.dto.AppointmentRequest;
import com.java.health.entity.Appointment;
import com.java.health.entity.AppointmentStatus;
import com.java.health.entity.Doctor;
import com.java.health.entity.Patients;
import com.java.health.entity.User;
import com.java.health.repository.AppointmentRepository;
import com.java.health.repository.DoctorRepository;
import com.java.health.repository.PatientRepository;
import com.java.health.repository.UserRepository;
import com.java.health.service.AppointmentService;
import com.java.health.service.PatientService;
import com.java.health.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientService patientService;
    private final PatientRepository patientRepository;
    private final AppointmentService appointmentService;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public PatientController(PatientService patientService, PatientRepository patientRepository, AppointmentService appointmentService, AppointmentRepository appointmentRepository, DoctorRepository doctorRepository, UserRepository userRepository, NotificationService notificationService) {
        this.patientService = patientService;
        this.patientRepository = patientRepository;
        this.appointmentService = appointmentService;
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
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

    @GetMapping("/me")
    public ResponseEntity<Patients> getMyProfile(Principal principal) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User user = userRepository.findByUsername(username).orElseThrow();
        
        Patients patient = patientRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        return ResponseEntity.ok(patient);
    }
    
    @PutMapping("/me")
    public ResponseEntity<Patients> updateMyProfile(Principal principal, @RequestBody com.java.health.dto.UpdateProfileRequest request) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User user = userRepository.findByUsername(username).orElseThrow();
        
        Patients patient = patientRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
                
        Patients savedPatient = patientService.updatePatient(patient.getPatientId(), request);
        return ResponseEntity.ok(savedPatient);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getPatientAppointments(Principal principal) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User patientUser = userRepository.findByUsername(username).orElse(null);
        if (patientUser == null) return ResponseEntity.ok(Collections.emptyList());

        Patients patient = patientRepository.findByUser_Id(patientUser.getId()).orElse(null);
        List<Appointment> apps = Collections.emptyList();
        if (patient != null) {
            apps = appointmentRepository.findByPatient_PatientId(patient.getPatientId());
        }
        if (apps.isEmpty()) {
            apps = appointmentRepository.findByPatient_User_Id(patientUser.getId());
        }
        return ResponseEntity.ok(apps);
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request, Principal principal) {
        String username = getUsername(principal);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required to book appointments. Your session may have expired.");
        }

        try {
            Appointment appointment = appointmentService.bookAppointment(request, username);
            return ResponseEntity.ok(appointment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment updated = appointmentRepository.save(appointment);

        if (appointment.getDoctor() != null && appointment.getDoctor().getUser() != null) {
            String patientName = appointment.getPatient() != null ? appointment.getPatient().getName() : "Patient";
            notificationService.createNotification(
                    appointment.getDoctor().getUser(),
                    "Appointment Cancelled",
                    "Appointment with " + patientName + " was cancelled.",
                    "APPOINTMENT"
            );
        }

        return ResponseEntity.ok(updated);
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getApprovedDoctors() {
        return ResponseEntity.ok(doctorRepository.findByStatus(Doctor.Status.APPROVED));
    }
}