package com.java.health.controller;

import com.java.health.entity.Appointment;
import com.java.health.repository.AppointmentRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class DebugController {
    private final AppointmentRepository appointmentRepository;
    
    public DebugController(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    
    @GetMapping("/api/debug/appointments")
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}
