package com.java.health.dto;

import java.time.LocalDate;

public class MedicalRecordResponse {
    private Long id;
    private String doctorName;
    private LocalDate recordDate;
    private String diagnosis;
    private String prescription;
    private String doctorNotes;

    public MedicalRecordResponse() {}

    public MedicalRecordResponse(Long id, String doctorName, LocalDate recordDate, String diagnosis, String prescription, String doctorNotes) {
        this.id = id;
        this.doctorName = doctorName;
        this.recordDate = recordDate;
        this.diagnosis = diagnosis;
        this.prescription = prescription;
        this.doctorNotes = doctorNotes;
    }

    public static MedicalRecordResponseBuilder builder() {
        return new MedicalRecordResponseBuilder();
    }

    public static class MedicalRecordResponseBuilder {
        private Long id;
        private String doctorName;
        private LocalDate recordDate;
        private String diagnosis;
        private String prescription;
        private String doctorNotes;

        public MedicalRecordResponseBuilder id(Long id) { this.id = id; return this; }
        public MedicalRecordResponseBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public MedicalRecordResponseBuilder recordDate(LocalDate recordDate) { this.recordDate = recordDate; return this; }
        public MedicalRecordResponseBuilder diagnosis(String diagnosis) { this.diagnosis = diagnosis; return this; }
        public MedicalRecordResponseBuilder prescription(String prescription) { this.prescription = prescription; return this; }
        public MedicalRecordResponseBuilder doctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; return this; }

        public MedicalRecordResponse build() {
            return new MedicalRecordResponse(id, doctorName, recordDate, diagnosis, prescription, doctorNotes);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getPrescription() { return prescription; }
    public void setPrescription(String prescription) { this.prescription = prescription; }

    public String getDoctorNotes() { return doctorNotes; }
    public void setDoctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; }
}