package com.java.health.controller;

import com.java.health.dto.AdminStatsDTO;
import com.java.health.dto.DoctorStatsDTO;
import com.java.health.dto.PatientStatsDTO;
import com.java.health.dto.AppointmentResponse;
import com.java.health.entity.Appointment;
import com.java.health.entity.AppointmentStatus;
import com.java.health.entity.Doctor;
import com.java.health.entity.Patients;
import com.java.health.entity.User;
import com.java.health.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public DashboardController(DoctorRepository doctorRepository, PatientRepository patientRepository, AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
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

    @GetMapping("/admin/stats")
    public ResponseEntity<AdminStatsDTO> getAdminStats() {
        long totalDocs = doctorRepository.count();
        long totalPatients = patientRepository.count();
        long totalApps = appointmentRepository.count();
        long pendingDocs = doctorRepository.findByStatus(Doctor.Status.PENDING).size();

        List<AppointmentResponse> recents = appointmentRepository.findAll().stream()
                .limit(10)
                .map(a -> AppointmentResponse.builder()
                        .id(a.getId())
                        .doctorName(a.getDoctor() != null ? a.getDoctor().getName() : "Dr. Practitioner")
                        .patientName(a.getPatient() != null ? a.getPatient().getName() : "Patient")
                        .appointmentDate(a.getAppointmentDate())
                        .reason(a.getReason())
                        .status(a.getStatus() != null ? a.getStatus().name() : "PENDING")
                        .build())
                .collect(Collectors.toList());

        AdminStatsDTO dto = AdminStatsDTO.builder()
                .totalDoctors(totalDocs)
                .totalPatients(totalPatients)
                .totalAppointments(totalApps)
                .pendingApprovals(pendingDocs)
                .recentAppointments(recents)
                .build();

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/doctor/stats")
    public ResponseEntity<DoctorStatsDTO> getDoctorStats(Principal principal) {
        String username = getUsername(principal);
        if (username == null) {
            return ResponseEntity.ok(new DoctorStatsDTO(0, 0, 0, Collections.emptyList()));
        }

        User doctorUser = userRepository.findByUsername(username).orElse(null);
        if (doctorUser == null) {
            return ResponseEntity.ok(new DoctorStatsDTO(0, 0, 0, Collections.emptyList()));
        }

        Doctor doctor = doctorRepository.findAll().stream()
                .filter(d -> d.getUser() != null && d.getUser().getId().equals(doctorUser.getId()))
                .findFirst()
                .orElse(null);

        List<Appointment> allApps = Collections.emptyList();
        if (doctor != null) {
            allApps = appointmentRepository.findByDoctor_Id(doctor.getId());
        }
        if (allApps.isEmpty()) {
            allApps = appointmentRepository.findByDoctor_User_Id(doctorUser.getId());
        }

        List<AppointmentResponse> todayResponses = allApps.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .map(a -> AppointmentResponse.builder()
                        .id(a.getId())
                        .doctorName(doctor != null ? doctor.getName() : doctorUser.getUsername())
                        .patientName(a.getPatient() != null ? a.getPatient().getName() : (a.getPatient() != null && a.getPatient().getUser() != null ? a.getPatient().getUser().getUsername() : "Patient"))
                        .appointmentDate(a.getAppointmentDate())
                        .reason(a.getReason())
                        .status(a.getStatus() != null ? a.getStatus().name() : "CONFIRMED")
                        .build())
                .collect(Collectors.toList());

        long completedCount = allApps.stream().filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();
        long pendingCount = allApps.stream().filter(a -> a.getStatus() == AppointmentStatus.PENDING || a.getStatus() == AppointmentStatus.CONFIRMED).count();

        DoctorStatsDTO dto = DoctorStatsDTO.builder()
                .todayAppointments(allApps.size())
                .totalPatientsSeen(completedCount)
                .pendingCount(pendingCount)
                .todayAppointmentsList(todayResponses)
                .build();

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/patient/stats")
    public ResponseEntity<PatientStatsDTO> getPatientStats(Principal principal) {
        String username = getUsername(principal);
        if (username == null) {
            return ResponseEntity.ok(new PatientStatsDTO(0, 0, 0, Collections.emptyList()));
        }

        User patientUser = userRepository.findByUsername(username).orElse(null);
        if (patientUser == null) {
            return ResponseEntity.ok(new PatientStatsDTO(0, 0, 0, Collections.emptyList()));
        }

        Patients patient = patientRepository.findByUser_Id(patientUser.getId()).orElse(null);

        List<Appointment> allApps = Collections.emptyList();
        if (patient != null) {
            allApps = appointmentRepository.findByPatient_PatientId(patient.getPatientId());
        }
        if (allApps.isEmpty()) {
            allApps = appointmentRepository.findByPatient_User_Id(patientUser.getId());
        }

        List<AppointmentResponse> upcomingResponses = allApps.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
                .map(a -> AppointmentResponse.builder()
                        .id(a.getId())
                        .doctorName(a.getDoctor() != null ? a.getDoctor().getName() : (a.getDoctor() != null && a.getDoctor().getUser() != null ? a.getDoctor().getUser().getUsername() : "Dr. Practitioner"))
                        .patientName(patient != null ? patient.getName() : patientUser.getUsername())
                        .appointmentDate(a.getAppointmentDate())
                        .reason(a.getReason())
                        .status(a.getStatus() != null ? a.getStatus().name() : "PENDING")
                        .build())
                .collect(Collectors.toList());

        long completedCount = allApps.stream().filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count();

        PatientStatsDTO dto = PatientStatsDTO.builder()
                .upcomingAppointmentsCount(upcomingResponses.stream().filter(a -> !"COMPLETED".equals(a.getStatus())).count())
                .totalPrescriptions(completedCount)
                .totalVisits(allApps.size())
                .upcomingAppointments(upcomingResponses)
                .build();

        return ResponseEntity.ok(dto);
    }
}
