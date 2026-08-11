package com.java.health.repository;

import com.java.health.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatient_User_IdOrderByCreatedAtDesc(Long userId);
    List<MedicalRecord> findByDoctor_User_IdOrderByCreatedAtDesc(Long userId);
    List<MedicalRecord> findByPatient_PatientIdOrderByCreatedAtDesc(Long patientId);
}
