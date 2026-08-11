package com.java.health.controller;


import com.java.health.dto.AppointmentRequest;
import com.java.health.entity.Appointment;
import com.java.health.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // POST: /api/appointments/book
    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody AppointmentRequest requestDTO,
                                                       Principal principal) {
        String patientEmail = principal.getName();
        Appointment savedAppointment = appointmentService.bookAppointment(requestDTO, patientEmail);
        return ResponseEntity.ok(savedAppointment);
    }

    // GET: /api/appointments/patient/history
    @GetMapping("/patient/history")
    public ResponseEntity<List<Appointment>> getPatientHistory(Principal principal) {
        String patientEmail = principal.getName();
        List<Appointment> history = appointmentService.getPatientAppointmentHistory(patientEmail);
        return ResponseEntity.ok(history);
    }
}