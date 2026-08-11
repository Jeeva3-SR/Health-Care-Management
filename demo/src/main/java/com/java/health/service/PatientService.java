package com.java.health.service;

import com.java.health.dto.UpdateProfileRequest;
import com.java.health.entity.Patients;
import com.java.health.entity.User;
import com.java.health.repository.PatientRepository;
import com.java.health.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientService(PatientRepository patientRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Patients getPatientById(Long patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    @Transactional
    public Patients updatePatient(Long patientId, UpdateProfileRequest request) {
        Patients patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (request.getName() != null) patient.setName(request.getName());
        if (request.getPhone() != null) patient.setPhone(request.getPhone());
        if (request.getAge() != null) patient.setAge(request.getAge());
        if (request.getGender() != null) patient.setGender(request.getGender());
        if (request.getBloodGroup() != null) patient.setBloodGroup(request.getBloodGroup());
        if (request.getEmergencyContact() != null) patient.setEmergencyContact(request.getEmergencyContact());
        if (request.getChronicConditions() != null) patient.setChronicConditions(request.getChronicConditions());

        User user = patient.getUser();
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

        return patientRepository.save(patient);
    }
}