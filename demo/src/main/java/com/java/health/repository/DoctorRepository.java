package com.java.health.repository;

import com.java.health.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByStatus(Doctor.Status status);
    List<Doctor> findAll();
    boolean existsByEmail(String email);
}
