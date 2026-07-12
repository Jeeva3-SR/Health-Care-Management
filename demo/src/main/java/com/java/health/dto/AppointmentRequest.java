package com.java.health.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class AppointmentRequest {
    private Long doctorId;
    private LocalDateTime appointmentDate;
    private String reason;


}