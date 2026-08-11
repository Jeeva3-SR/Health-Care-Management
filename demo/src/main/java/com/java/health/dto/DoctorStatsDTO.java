package com.java.health.dto;

import java.util.List;

public class DoctorStatsDTO {
    private long todayAppointments;
    private long totalPatientsSeen;
    private long pendingCount;
    private List<AppointmentResponse> todayAppointmentsList;

    public DoctorStatsDTO() {}

    public DoctorStatsDTO(long todayAppointments, long totalPatientsSeen, long pendingCount, List<AppointmentResponse> todayAppointmentsList) {
        this.todayAppointments = todayAppointments;
        this.totalPatientsSeen = totalPatientsSeen;
        this.pendingCount = pendingCount;
        this.todayAppointmentsList = todayAppointmentsList;
    }

    public static DoctorStatsDTOBuilder builder() {
        return new DoctorStatsDTOBuilder();
    }

    public static class DoctorStatsDTOBuilder {
        private long todayAppointments;
        private long totalPatientsSeen;
        private long pendingCount;
        private List<AppointmentResponse> todayAppointmentsList;

        public DoctorStatsDTOBuilder todayAppointments(long todayAppointments) { this.todayAppointments = todayAppointments; return this; }
        public DoctorStatsDTOBuilder totalPatientsSeen(long totalPatientsSeen) { this.totalPatientsSeen = totalPatientsSeen; return this; }
        public DoctorStatsDTOBuilder pendingCount(long pendingCount) { this.pendingCount = pendingCount; return this; }
        public DoctorStatsDTOBuilder todayAppointmentsList(List<AppointmentResponse> todayAppointmentsList) { this.todayAppointmentsList = todayAppointmentsList; return this; }

        public DoctorStatsDTO build() {
            return new DoctorStatsDTO(todayAppointments, totalPatientsSeen, pendingCount, todayAppointmentsList);
        }
    }

    public long getTodayAppointments() { return todayAppointments; }
    public void setTodayAppointments(long todayAppointments) { this.todayAppointments = todayAppointments; }

    public long getTotalPatientsSeen() { return totalPatientsSeen; }
    public void setTotalPatientsSeen(long totalPatientsSeen) { this.totalPatientsSeen = totalPatientsSeen; }

    public long getPendingCount() { return pendingCount; }
    public void setPendingCount(long pendingCount) { this.pendingCount = pendingCount; }

    public List<AppointmentResponse> getTodayAppointmentsList() { return todayAppointmentsList; }
    public void setTodayAppointmentsList(List<AppointmentResponse> todayAppointmentsList) { this.todayAppointmentsList = todayAppointmentsList; }
}
