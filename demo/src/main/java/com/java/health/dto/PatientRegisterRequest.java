package com.java.health.dto;

import lombok.Data;

@Data
public class PatientRegisterRequest {
    private String username;
    private String password;
    private String fullName;
    private String role;

}