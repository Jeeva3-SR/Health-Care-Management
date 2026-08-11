package com.java.health.dto;

import java.time.LocalDate;

public class PrescriptionDTO {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String medication;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;
    private LocalDate prescribedDate;
    private String status;

    public PrescriptionDTO() {}

    public PrescriptionDTO(Long id, Long patientId, String patientName, Long doctorId, String doctorName, String medication, String dosage, String frequency, String duration, String instructions, LocalDate prescribedDate, String status) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.medication = medication;
        this.dosage = dosage;
        this.frequency = frequency;
        this.duration = duration;
        this.instructions = instructions;
        this.prescribedDate = prescribedDate;
        this.status = status;
    }

    public static PrescriptionDTOBuilder builder() {
        return new PrescriptionDTOBuilder();
    }

    public static class PrescriptionDTOBuilder {
        private Long id;
        private Long patientId;
        private String patientName;
        private Long doctorId;
        private String doctorName;
        private String medication;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;
        private LocalDate prescribedDate;
        private String status;

        public PrescriptionDTOBuilder id(Long id) { this.id = id; return this; }
        public PrescriptionDTOBuilder patientId(Long patientId) { this.patientId = patientId; return this; }
        public PrescriptionDTOBuilder patientName(String patientName) { this.patientName = patientName; return this; }
        public PrescriptionDTOBuilder doctorId(Long doctorId) { this.doctorId = doctorId; return this; }
        public PrescriptionDTOBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public PrescriptionDTOBuilder medication(String medication) { this.medication = medication; return this; }
        public PrescriptionDTOBuilder dosage(String dosage) { this.dosage = dosage; return this; }
        public PrescriptionDTOBuilder frequency(String frequency) { this.frequency = frequency; return this; }
        public PrescriptionDTOBuilder duration(String duration) { this.duration = duration; return this; }
        public PrescriptionDTOBuilder instructions(String instructions) { this.instructions = instructions; return this; }
        public PrescriptionDTOBuilder prescribedDate(LocalDate prescribedDate) { this.prescribedDate = prescribedDate; return this; }
        public PrescriptionDTOBuilder status(String status) { this.status = status; return this; }

        public PrescriptionDTO build() {
            return new PrescriptionDTO(id, patientId, patientName, doctorId, doctorName, medication, dosage, frequency, duration, instructions, prescribedDate, status);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getMedication() { return medication; }
    public void setMedication(String medication) { this.medication = medication; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public LocalDate getPrescribedDate() { return prescribedDate; }
    public void setPrescribedDate(LocalDate prescribedDate) { this.prescribedDate = prescribedDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
