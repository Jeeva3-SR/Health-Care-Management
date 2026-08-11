package com.java.health.repository;

import com.java.health.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatient_User_IdOrderByCreatedAtDesc(Long userId);
    List<Prescription> findByDoctor_User_IdOrderByCreatedAtDesc(Long userId);
}
