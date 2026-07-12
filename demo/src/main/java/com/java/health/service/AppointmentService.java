package com.java.health.service;

import com.java.health.dto.AppointmentRequest;
import com.java.health.entity.Appointment;
import com.java.health.entity.AppointmentStatus;
import com.java.health.entity.User;
import com.java.health.repository.AppointmentRepository;
import com.java.health.repository.UserRepository; // Assuming you have a UserRepository
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Service
public class AppointmentService {

    private AppointmentRepository appointmentRepository;
    private UserRepository userRepository;

    public Appointment bookAppointment(AppointmentRequest dto, String patientEmail) {
        // 1. Find the logged-in patient using email extracted from JWT
        User patient = userRepository.findByUsername(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // 2. Find the requested doctor
        User doctor = userRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 3. Build and save the appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setReason(dto.getReason());
        appointment.setStatus(AppointmentStatus.PENDING);

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getPatientAppointmentHistory(String patientEmail) {
        User patient = userRepository.findByUsername(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return appointmentRepository.findByPatientId(patient.getId());
    }
}