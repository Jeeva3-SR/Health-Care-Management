package com.java.health.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AppointmentResponse {
    private Long id;
    private String doctorName;
    private LocalDateTime appointmentDate;
    private String status;
    private String reason;
    private String patientName;
}