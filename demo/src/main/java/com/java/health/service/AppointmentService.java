package com.java.health.service;

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final NotificationService notificationService;

    public AppointmentService(AppointmentRepository appointmentRepository, UserRepository userRepository, DoctorRepository doctorRepository, PatientRepository patientRepository, NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Appointment bookAppointment(AppointmentRequest dto, String patientEmail) {

        User patientUser = userRepository.findByUsername(patientEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Patient account not found."));
                        
        Patients patient = patientRepository.findByUser_Id(patientUser.getId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Patient profile not found."));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Doctor not found."));

        User doctorUser = doctor.getUser();

        if (doctorUser == null) {
            throw new IllegalArgumentException("Doctor account is not linked to a user.");
        }

        if (dto.getAppointmentDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Appointment date cannot be in the past.");
        }

        if (patientUser.getId().equals(doctorUser.getId())) {
            throw new IllegalArgumentException("You cannot book an appointment with yourself.");
        }

        boolean slotTaken = appointmentRepository
                .existsByDoctor_IdAndAppointmentDateAndStatusNot(
                        doctor.getId(),
                        dto.getAppointmentDate(),
                        AppointmentStatus.CANCELLED);

        if (!slotTaken && doctor.getUser() != null) {
            slotTaken = appointmentRepository
                    .existsByDoctor_User_IdAndAppointmentDateAndStatusNot(
                            doctor.getUser().getId(),
                            dto.getAppointmentDate(),
                            AppointmentStatus.CANCELLED);
        }

        if (slotTaken) {
            throw new IllegalArgumentException(
                    "This appointment slot is already booked by another patient. Please choose a different date or time slot.");
        }
        
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setReason(dto.getReason());
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        Appointment saved = appointmentRepository.save(appointment);

        // Notify Doctor
        if (doctor.getUser() != null) {
            notificationService.createNotification(
                    doctor.getUser(),
                    "New Appointment Booked",
                    "Patient " + patient.getName() + " booked an appointment for " + dto.getAppointmentDate().toString().replace("T", " ") + ".",
                    "APPOINTMENT"
            );
        }

        // Notify Patient
        if (patientUser != null) {
            notificationService.createNotification(
                    patientUser,
                    "Appointment Confirmed",
                    "Your appointment with Dr. " + doctor.getName() + " is confirmed for " + dto.getAppointmentDate().toString().replace("T", " ") + ".",
                    "APPOINTMENT"
            );
        }

        return saved;
    }

    public List<Appointment> getPatientAppointmentHistory(String patientEmail) {
        User patientUser = userRepository.findByUsername(patientEmail)
                .orElseThrow(() -> new IllegalArgumentException("Patient account not found"));
        return appointmentRepository.findByPatient_User_Id(patientUser.getId());
    }
}