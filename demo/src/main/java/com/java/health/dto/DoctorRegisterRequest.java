package com.java.health.dto;

import org.springframework.web.multipart.MultipartFile;

public class DoctorRegisterRequest {
    private String name;
    private String email;
    private String degree;
    private String specialization;
    private String hospitalName;
    private String hospitalLocation;
    private MultipartFile proof;

    public DoctorRegisterRequest() {}

    public DoctorRegisterRequest(String name, String email, String degree, String specialization, String hospitalName, String hospitalLocation, MultipartFile proof) {
        this.name = name;
        this.email = email;
        this.degree = degree;
        this.specialization = specialization;
        this.hospitalName = hospitalName;
        this.hospitalLocation = hospitalLocation;
        this.proof = proof;
    }

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

    public MultipartFile getProof() { return proof; }
    public void setProof(MultipartFile proof) { this.proof = proof; }
}