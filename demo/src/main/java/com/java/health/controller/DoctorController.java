package com.java.health.controller;

import com.java.health.dto.DoctorRegisterRequest;
import com.java.health.entity.Appointment;
import com.java.health.entity.AppointmentStatus;
import com.java.health.entity.Doctor;
import com.java.health.entity.Role;
import com.java.health.entity.User;
import com.java.health.repository.AppointmentRepository;
import com.java.health.repository.DoctorRepository;
import com.java.health.repository.UserRepository;
import com.java.health.service.DoctorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private final DoctorService doctorService;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final com.java.health.service.NotificationService notificationService;

    public DoctorController(DoctorService doctorService, DoctorRepository doctorRepository, AppointmentRepository appointmentRepository, UserRepository userRepository, com.java.health.service.NotificationService notificationService) {
        this.doctorService = doctorService;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
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

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> registerDoctor(@ModelAttribute DoctorRegisterRequest request) {
        doctorService.registerDoctor(request);
        return new ResponseEntity<>("Registration submitted for verification.", HttpStatus.CREATED);
    }

    @GetMapping("/pending-doctors")
    public ResponseEntity<List<Doctor>> getPendingDoctors() {
        return ResponseEntity.ok(doctorService.getPendingDoctors());
    }

    @GetMapping("/all-doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(Principal principal) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User doctorUser = userRepository.findByUsername(username).orElse(null);
        if (doctorUser == null) return ResponseEntity.ok(Collections.emptyList());

        Doctor doctor = doctorRepository.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getId().equals(doctorUser.getId()))
                .findFirst()
                .orElse(null);

        List<Appointment> apps = Collections.emptyList();
        if (doctor != null) {
            apps = appointmentRepository.findByDoctor_Id(doctor.getId());
        }
        if (apps.isEmpty()) {
            apps = appointmentRepository.findByDoctor_User_Id(doctorUser.getId());
        }
        return ResponseEntity.ok(apps);
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id, @RequestParam String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(AppointmentStatus.valueOf(status.toUpperCase()));
        Appointment updated = appointmentRepository.save(appointment);

        if (appointment.getPatient() != null && appointment.getPatient().getUser() != null) {
            notificationService.createNotification(
                    appointment.getPatient().getUser(),
                    "Appointment Status Updated",
                    "Your appointment status is now " + status.toUpperCase() + ".",
                    "APPOINTMENT"
            );
        }

        return ResponseEntity.ok(updated);
    }

    @PutMapping("/appointments/{id}/complete")
    public ResponseEntity<Appointment> completeAppointment(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setDiagnosis(payload.get("diagnosis"));
        appointment.setPrescriptionDetails(payload.get("prescriptionDetails"));
        appointment.setStatus(AppointmentStatus.COMPLETED);
        
        Appointment updated = appointmentRepository.save(appointment);

        if (appointment.getPatient() != null && appointment.getPatient().getUser() != null) {
            notificationService.createNotification(
                    appointment.getPatient().getUser(),
                    "Appointment Completed & Medical Record Issued",
                    "Your appointment has been marked COMPLETED. Medical record and prescription are available.",
                    "MEDICAL_RECORD"
            );
        }

        return ResponseEntity.ok(updated);
    }

    @GetMapping("/patients")
    public ResponseEntity<List<User>> getDoctorPatients(Principal principal) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User doctorUser = userRepository.findByUsername(username).orElse(null);
        if (doctorUser == null) return ResponseEntity.ok(Collections.emptyList());

        Doctor doctor = doctorRepository.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getId().equals(doctorUser.getId()))
                .findFirst()
                .orElse(null);

        List<Appointment> apps = Collections.emptyList();
        if (doctor != null) {
            apps = appointmentRepository.findByDoctor_Id(doctor.getId());
        }
        if (apps.isEmpty()) {
            apps = appointmentRepository.findByDoctor_User_Id(doctorUser.getId());
        }

        List<User> attendedPatientUsers = apps.stream()
                .filter(a -> a.getPatient() != null && a.getPatient().getUser() != null)
                .map(a -> a.getPatient().getUser())
                .distinct()
                .toList();

        return ResponseEntity.ok(attendedPatientUsers);
    }

    @PutMapping("/schedule")
    public ResponseEntity<Doctor> updateSchedule(@RequestBody Map<String, String> scheduleData, Principal principal) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User doctorUser = userRepository.findByUsername(username).orElseThrow();
        Doctor doctor = doctorRepository.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getId().equals(doctorUser.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        if (scheduleData.containsKey("startTime")) doctor.setStartTime(scheduleData.get("startTime"));
        if (scheduleData.containsKey("endTime")) doctor.setEndTime(scheduleData.get("endTime"));
        if (scheduleData.containsKey("morningSlot")) doctor.setMorningSlot(scheduleData.get("morningSlot"));
        if (scheduleData.containsKey("afternoonSlot")) doctor.setAfternoonSlot(scheduleData.get("afternoonSlot"));

        Doctor updated = doctorRepository.save(doctor);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/me")
    public ResponseEntity<Doctor> getMyProfile(Principal principal) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User user = userRepository.findByUsername(username).orElseThrow();
        
        Doctor doctor = doctorRepository.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        return ResponseEntity.ok(doctor);
    }

    @PutMapping("/me")
    public ResponseEntity<Doctor> updateMyProfile(Principal principal, @RequestBody com.java.health.dto.UpdateProfileRequest request) {
        String username = getUsername(principal);
        if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        User user = userRepository.findByUsername(username).orElseThrow();
        
        Doctor doctor = doctorRepository.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
                
        Doctor savedDoctor = doctorService.updateDoctorProfile(doctor.getId(), request);
        return ResponseEntity.ok(savedDoctor);
    }
}