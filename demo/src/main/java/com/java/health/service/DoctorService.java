package com.java.health.service;

import com.java.health.dto.DoctorRegisterRequest;
import com.java.health.entity.Doctor;
import com.java.health.entity.User;
import com.java.health.entity.Role;
import com.java.health.repository.DoctorRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
import java.util.*;


import com.java.health.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.mail.javamail.JavaMailSender;

@RequiredArgsConstructor
@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${upload.path}")
    private String uploadFolder;


    @Transactional
    public void registerDoctor(DoctorRegisterRequest request) {
        if (doctorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        if (request.getProof() == null || request.getProof().isEmpty()) {
            throw new IllegalArgumentException("A valid verification file is required.");
        }

        try {
            Path directory = Paths.get(uploadFolder);
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }

            String uniqueFileName = UUID.randomUUID() + "_" + request.getProof().getOriginalFilename();
            Path targetPath = directory.resolve(uniqueFileName);
            Files.copy(request.getProof().getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            Doctor doctor = new Doctor();
            doctor.setName(request.getName());
            doctor.setEmail(request.getEmail());
            doctor.setDegree(request.getDegree());
            doctor.setSpecialization(request.getSpecialization());
            doctor.setHospitalName(request.getHospitalName());
            doctor.setHospitalLocation(request.getHospitalLocation());
            doctor.setVerificationProofPath(targetPath.toString());
            doctor.setStatus(Doctor.Status.PENDING);

            doctorRepository.save(doctor);
        } catch (IOException e) {
            throw new RuntimeException("Could not persist file metadata securely.", e);
        }
    }

    // Append these methods inside your com.java.health.service.DoctorService class



    @Transactional
    public void approveDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor identity records not found."));

        if (doctor.getStatus() != Doctor.Status.PENDING) {
            throw new IllegalStateException("Doctor is not pending validation approval.");
        }

        // 1. Generate Secure Password
        String rawPassword = com.java.health.util.PasswordGenerator.generateSecurePassword();

        // 2. Map and Save Authentication Principal
        User user = new User();
        user.setUsername(doctor.getEmail());
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(Role.DOCTOR);
        User savedUser = userRepository.save(user);

        // 3. Complete Linkage & Update Lifecycle Status
        doctor.setUser(savedUser);
        doctor.setStatus(Doctor.Status.APPROVED);
        doctorRepository.save(doctor);

        // 4. Asynchronously send notifications out of band
        //sendCredentialsEmail(doctor.getEmail(), doctor.getName(), rawPassword);
        System.out.println("------------------------------------");
        System.out.println("Doctor Approved");
        System.out.println("Username : " + doctor.getEmail());
        System.out.println("Password : " + rawPassword);
        System.out.println("------------------------------------");
    }

    private void sendCredentialsEmail(String email, String name, String password) {
        try {
            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Clinical Workspace Portal Account Activated");
            message.setText(String.format("Hello Dr. %s,\n\nYour onboarding portfolio has been verified by the administration team.\n\n" +
                            "Portal Credentials:\nUsername: %s\nTemporary Password: %s\n\nPlease rotate your temporary password upon entry.",
                    name, email, password));
            mailSender.send(message);
        } catch (Exception e) {
            // Log exception via Logger abstraction. Do not fail transaction if communication grid times out.
        }
    }
    public List<Doctor> getPendingDoctors() {
        return doctorRepository.findByStatus(Doctor.Status.PENDING);
    }

}