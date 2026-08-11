package com.java.health.repository;

import com.java.health.entity.Appointment;
import com.java.health.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient_User_Id(Long userId);
    List<Appointment> findByPatient_PatientId(Long patientId);
    List<Appointment> findByDoctor_Id(Long doctorId);
    List<Appointment> findByDoctor_User_Id(Long userId);

    List<Appointment> findByDoctor_IdAndStatus(Long doctorId, AppointmentStatus status);

    List<Appointment> findByDoctor_IdAndAppointmentDateBetween(Long doctorId, LocalDateTime start, LocalDateTime end);

    List<Appointment> findByPatient_PatientIdAndAppointmentDateAfter(Long patientId, LocalDateTime dateTime);

    boolean existsByDoctor_IdAndAppointmentDateAndStatusNot(Long doctorId, LocalDateTime appointmentDate, AppointmentStatus status);
    boolean existsByDoctor_User_IdAndAppointmentDateAndStatusNot(Long userId, LocalDateTime appointmentDate, AppointmentStatus status);

    @Query("SELECT COUNT(DISTINCT a.patient.patientId) FROM Appointment a WHERE a.doctor.id = :doctorId")
    long countDistinctPatientsByDoctorId(@Param("doctorId") Long doctorId);

    long countByDoctor_IdAndStatus(Long doctorId, AppointmentStatus status);

    long countByPatient_PatientId(Long patientId);
    long countByPatient_User_Id(Long userId);

    @Query("SELECT a FROM Appointment a ORDER BY a.appointmentDate DESC")
    List<Appointment> findRecentAppointments();
}