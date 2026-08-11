package com.java.health.controller;

import com.java.health.entity.Appointment;
import com.java.health.entity.Doctor;
import com.java.health.entity.Patients;
import com.java.health.repository.AppointmentRepository;
import com.java.health.repository.DoctorRepository;
import com.java.health.repository.PatientRepository;
import com.java.health.service.DoctorService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DoctorService doctorService;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminController(DoctorService doctorService, DoctorRepository doctorRepository, PatientRepository patientRepository, AppointmentRepository appointmentRepository) {
        this.doctorService = doctorService;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @PutMapping("/doctors/approve/{id}")
    public ResponseEntity<Map<String, String>> approveDoctor(@PathVariable Long id) {
        String generatedPassword = doctorService.approveDoctor(id);
        Doctor doctor = doctorRepository.findById(id).orElseThrow();

        Map<String, String> response = new HashMap<>();
        response.put("message", "Doctor account verified successfully.");
        response.put("email", doctor.getEmail());
        response.put("password", generatedPassword);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/doctors/reject/{id}")
    public ResponseEntity<Map<String, String>> rejectDoctor(@PathVariable Long id) {
        doctorService.rejectDoctor(id);
        return ResponseEntity.ok(Map.of("message", "Doctor registration rejected successfully."));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/doctors/proof/{fileName:.+}")
    public ResponseEntity<Resource> getDoctorProof(@PathVariable String fileName) {
        try {
            Path filePath = doctorService.getUploadFolderDirectory().resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "application/pdf";
            if (fileName.toLowerCase().endsWith(".png")) contentType = "image/png";
            else if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg")) contentType = "image/jpeg";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patients>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }
}