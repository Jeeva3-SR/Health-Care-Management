package com.java.health.dto;

public class MedicalRecordRequest {
    private Long patientId;
    private String diagnosis;
    private String treatment;
    private String prescription;
    private String doctorNotes;

    public MedicalRecordRequest() {}

    public MedicalRecordRequest(Long patientId, String diagnosis, String treatment, String prescription, String doctorNotes) {
        this.patientId = patientId;
        this.diagnosis = diagnosis;
        this.treatment = treatment;
        this.prescription = prescription;
        this.doctorNotes = doctorNotes;
    }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getTreatment() { return treatment; }
    public void setTreatment(String treatment) { this.treatment = treatment; }

    public String getPrescription() { return prescription; }
    public void setPrescription(String prescription) { this.prescription = prescription; }

    public String getDoctorNotes() { return doctorNotes; }
    public void setDoctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; }
}
