package com.java.health.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.java.health.entity.Patients;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patients,Long> {

    Optional<Patients> findByPhone(String phone);
    Optional<Patients> findById(Long id);
    boolean existsByPhone(String phone);
    
    Optional<Patients> findByUser_Id(Long userId);
    Optional<Patients> findByUser_Username(String username);

}
