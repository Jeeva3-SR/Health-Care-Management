package com.java.health.dto;

import java.util.List;

public class AdminStatsDTO {
    private long totalDoctors;
    private long totalPatients;
    private long totalAppointments;
    private long pendingApprovals;
    private List<AppointmentResponse> recentAppointments;

    public AdminStatsDTO() {}

    public AdminStatsDTO(long totalDoctors, long totalPatients, long totalAppointments, long pendingApprovals, List<AppointmentResponse> recentAppointments) {
        this.totalDoctors = totalDoctors;
        this.totalPatients = totalPatients;
        this.totalAppointments = totalAppointments;
        this.pendingApprovals = pendingApprovals;
        this.recentAppointments = recentAppointments;
    }

    public static AdminStatsDTOBuilder builder() {
        return new AdminStatsDTOBuilder();
    }

    public static class AdminStatsDTOBuilder {
        private long totalDoctors;
        private long totalPatients;
        private long totalAppointments;
        private long pendingApprovals;
        private List<AppointmentResponse> recentAppointments;

        public AdminStatsDTOBuilder totalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; return this; }
        public AdminStatsDTOBuilder totalPatients(long totalPatients) { this.totalPatients = totalPatients; return this; }
        public AdminStatsDTOBuilder totalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; return this; }
        public AdminStatsDTOBuilder pendingApprovals(long pendingApprovals) { this.pendingApprovals = pendingApprovals; return this; }
        public AdminStatsDTOBuilder recentAppointments(List<AppointmentResponse> recentAppointments) { this.recentAppointments = recentAppointments; return this; }

        public AdminStatsDTO build() {
            return new AdminStatsDTO(totalDoctors, totalPatients, totalAppointments, pendingApprovals, recentAppointments);
        }
    }

    public long getTotalDoctors() { return totalDoctors; }
    public void setTotalDoctors(long totalDoctors) { this.totalDoctors = totalDoctors; }

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(long totalAppointments) { this.totalAppointments = totalAppointments; }

    public long getPendingApprovals() { return pendingApprovals; }
    public void setPendingApprovals(long pendingApprovals) { this.pendingApprovals = pendingApprovals; }

    public List<AppointmentResponse> getRecentAppointments() { return recentAppointments; }
    public void setRecentAppointments(List<AppointmentResponse> recentAppointments) { this.recentAppointments = recentAppointments; }
}
