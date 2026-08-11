package com.java.health.service;

import com.java.health.dto.DoctorRegisterRequest;
import com.java.health.entity.Doctor;
import com.java.health.entity.Role;
import com.java.health.entity.User;
import com.java.health.repository.DoctorRepository;
import com.java.health.repository.UserRepository;
import com.java.health.util.PasswordGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${upload.path:./uploads/proofs/}")
    private String uploadFolder;

    public DoctorService(DoctorRepository doctorRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, JavaMailSender mailSender) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Transactional
    public void registerDoctor(DoctorRegisterRequest request) {
        if (doctorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        if (request.getProof() == null || request.getProof().isEmpty()) {
            throw new IllegalArgumentException("A valid verification file is required.");
        }

        try {
            Path directory = Paths.get(uploadFolder).toAbsolutePath().normalize();
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }

            String originalName = request.getProof().getOriginalFilename();
            String cleanName = originalName != null ? originalName.replaceAll("[^a-zA-Z0-9._-]", "_") : "proof.pdf";
            String uniqueFileName = UUID.randomUUID() + "_" + cleanName;

            Path targetPath = directory.resolve(uniqueFileName);
            Files.copy(request.getProof().getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            Doctor doctor = new Doctor();
            doctor.setName(request.getName());
            doctor.setEmail(request.getEmail());
            doctor.setDegree(request.getDegree());
            doctor.setSpecialization(request.getSpecialization());
            doctor.setHospitalName(request.getHospitalName());
            doctor.setHospitalLocation(request.getHospitalLocation());
            doctor.setVerificationProofPath(uniqueFileName);
            doctor.setStatus(Doctor.Status.PENDING);

            doctorRepository.save(doctor);
        } catch (IOException e) {
            throw new RuntimeException("Could not persist verification file.", e);
        }
    }

    @Transactional
    public String approveDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor identity records not found."));

        if (doctor.getStatus() != Doctor.Status.PENDING) {
            throw new IllegalStateException("Doctor is not pending validation approval.");
        }

        String rawPassword = PasswordGenerator.generateSecurePassword();

        User user = new User();
        user.setUsername(doctor.getEmail());
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(Role.DOCTOR);
        user.setRequiresPasswordChange(true);
        User savedUser = userRepository.save(user);

        doctor.setUser(savedUser);
        doctor.setStatus(Doctor.Status.APPROVED);
        doctorRepository.save(doctor);

        System.out.println("\n\n========================================================");
        System.out.println("  [DOCTOR APPROVED] CREDENTIALS GENERATED");
        System.out.println("  DOCTOR EMAIL   : " + doctor.getEmail());
        System.out.println("  PLAIN PASSWORD : " + rawPassword);
        System.out.println("========================================================\n\n");

        return rawPassword;
    }

    public List<Doctor> getPendingDoctors() {
        return doctorRepository.findByStatus(Doctor.Status.PENDING);
    }

    public Path getUploadFolderDirectory() {
        return Paths.get(uploadFolder).toAbsolutePath().normalize();
    }
    
    @Transactional
    public Doctor updateDoctorProfile(Long doctorId, com.java.health.dto.UpdateProfileRequest request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (request.getName() != null) doctor.setName(request.getName());
        if (request.getEmail() != null) doctor.setEmail(request.getEmail());
        if (request.getDegree() != null) doctor.setDegree(request.getDegree());
        if (request.getSpecialization() != null) doctor.setSpecialization(request.getSpecialization());
        if (request.getHospitalName() != null) doctor.setHospitalName(request.getHospitalName());
        if (request.getHospitalLocation() != null) doctor.setHospitalLocation(request.getHospitalLocation());

        User user = doctor.getUser();
        if (user != null) {
            boolean userUpdated = false;
            if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && !user.getUsername().equals(request.getEmail())) {
                user.setUsername(request.getEmail());
                userUpdated = true;
            }
            
            if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                userUpdated = true;
            }
            
            if (userUpdated) {
                userRepository.save(user);
            }
        }

        return doctorRepository.save(doctor);
    }

    @Transactional
    public void rejectDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        doctor.setStatus(Doctor.Status.REJECTED);
        doctorRepository.save(doctor);
    }
}