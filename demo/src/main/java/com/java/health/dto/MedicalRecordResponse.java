package com.java.health.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class MedicalRecordResponse {
    private Long id;
    private String doctorName;
    private LocalDate recordDate;
    private String diagnosis;
    private String prescription;
    private String doctorNotes;
}