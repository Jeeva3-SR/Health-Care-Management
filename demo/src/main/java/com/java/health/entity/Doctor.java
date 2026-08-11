package com.java.health.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String degree;

    @Column(nullable = false)
    private String specialization;

    private String hospitalName;
    private String hospitalLocation;

    @Column(nullable = false)
    private String verificationProofPath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(nullable = false)
    private String startTime = "09:30";

    @Column(nullable = false)
    private String endTime = "16:30";

    @Column(nullable = false)
    private String morningSlot = "09:30 - 12:30";

    @Column(nullable = false)
    private String afternoonSlot = "13:30 - 16:30";

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @org.hibernate.annotations.NotFound(action = org.hibernate.annotations.NotFoundAction.IGNORE)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User user;

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }

    public Doctor() {}

    public Doctor(Long id, String name, String email, String degree, String specialization, String hospitalName, String hospitalLocation, String verificationProofPath, Status status, String startTime, String endTime, String morningSlot, String afternoonSlot, User user) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.degree = degree;
        this.specialization = specialization;
        this.hospitalName = hospitalName;
        this.hospitalLocation = hospitalLocation;
        this.verificationProofPath = verificationProofPath;
        this.status = status;
        this.startTime = startTime != null ? startTime : "09:30";
        this.endTime = endTime != null ? endTime : "16:30";
        this.morningSlot = morningSlot != null ? morningSlot : "09:30 - 12:30";
        this.afternoonSlot = afternoonSlot != null ? afternoonSlot : "13:30 - 16:30";
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getHospitalLocation() { return hospitalLocation; }
    public void setHospitalLocation(String hospitalLocation) { this.hospitalLocation = hospitalLocation; }

    public String getVerificationProofPath() { return verificationProofPath; }
    public void setVerificationProofPath(String verificationProofPath) { this.verificationProofPath = verificationProofPath; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getMorningSlot() { return morningSlot; }
    public void setMorningSlot(String morningSlot) { this.morningSlot = morningSlot; }

    public String getAfternoonSlot() { return afternoonSlot; }
    public void setAfternoonSlot(String afternoonSlot) { this.afternoonSlot = afternoonSlot; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}