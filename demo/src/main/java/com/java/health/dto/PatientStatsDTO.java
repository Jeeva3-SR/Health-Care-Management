package com.java.health.dto;

import java.util.List;

public class PatientStatsDTO {
    private long upcomingAppointmentsCount;
    private long totalPrescriptions;
    private long totalVisits;
    private List<AppointmentResponse> upcomingAppointments;

    public PatientStatsDTO() {}

    public PatientStatsDTO(long upcomingAppointmentsCount, long totalPrescriptions, long totalVisits, List<AppointmentResponse> upcomingAppointments) {
        this.upcomingAppointmentsCount = upcomingAppointmentsCount;
        this.totalPrescriptions = totalPrescriptions;
        this.totalVisits = totalVisits;
        this.upcomingAppointments = upcomingAppointments;
    }

    public static PatientStatsDTOBuilder builder() {
        return new PatientStatsDTOBuilder();
    }

    public static class PatientStatsDTOBuilder {
        private long upcomingAppointmentsCount;
        private long totalPrescriptions;
        private long totalVisits;
        private List<AppointmentResponse> upcomingAppointments;

        public PatientStatsDTOBuilder upcomingAppointmentsCount(long upcomingAppointmentsCount) { this.upcomingAppointmentsCount = upcomingAppointmentsCount; return this; }
        public PatientStatsDTOBuilder totalPrescriptions(long totalPrescriptions) { this.totalPrescriptions = totalPrescriptions; return this; }
        public PatientStatsDTOBuilder totalVisits(long totalVisits) { this.totalVisits = totalVisits; return this; }
        public PatientStatsDTOBuilder upcomingAppointments(List<AppointmentResponse> upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; return this; }

        public PatientStatsDTO build() {
            return new PatientStatsDTO(upcomingAppointmentsCount, totalPrescriptions, totalVisits, upcomingAppointments);
        }
    }

    public long getUpcomingAppointmentsCount() { return upcomingAppointmentsCount; }
    public void setUpcomingAppointmentsCount(long upcomingAppointmentsCount) { this.upcomingAppointmentsCount = upcomingAppointmentsCount; }

    public long getTotalPrescriptions() { return totalPrescriptions; }
    public void setTotalPrescriptions(long totalPrescriptions) { this.totalPrescriptions = totalPrescriptions; }

    public long getTotalVisits() { return totalVisits; }
    public void setTotalVisits(long totalVisits) { this.totalVisits = totalVisits; }

    public List<AppointmentResponse> getUpcomingAppointments() { return upcomingAppointments; }
    public void setUpcomingAppointments(List<AppointmentResponse> upcomingAppointments) { this.upcomingAppointments = upcomingAppointments; }
}
