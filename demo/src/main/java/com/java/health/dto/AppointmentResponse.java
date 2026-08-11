package com.java.health.dto;

import java.time.LocalDateTime;

public class AppointmentResponse {
    private Long id;
    private String doctorName;
    private LocalDateTime appointmentDate;
    private String status;
    private String reason;
    private String patientName;

    public AppointmentResponse() {}

    public AppointmentResponse(Long id, String doctorName, LocalDateTime appointmentDate, String status, String reason, String patientName) {
        this.id = id;
        this.doctorName = doctorName;
        this.appointmentDate = appointmentDate;
        this.status = status;
        this.reason = reason;
        this.patientName = patientName;
    }

    public static AppointmentResponseBuilder builder() {
        return new AppointmentResponseBuilder();
    }

    public static class AppointmentResponseBuilder {
        private Long id;
        private String doctorName;
        private LocalDateTime appointmentDate;
        private String status;
        private String reason;
        private String patientName;

        public AppointmentResponseBuilder id(Long id) { this.id = id; return this; }
        public AppointmentResponseBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public AppointmentResponseBuilder appointmentDate(LocalDateTime appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public AppointmentResponseBuilder status(String status) { this.status = status; return this; }
        public AppointmentResponseBuilder reason(String reason) { this.reason = reason; return this; }
        public AppointmentResponseBuilder patientName(String patientName) { this.patientName = patientName; return this; }

        public AppointmentResponse build() {
            return new AppointmentResponse(id, doctorName, appointmentDate, status, reason, patientName);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public LocalDateTime getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDateTime appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
}