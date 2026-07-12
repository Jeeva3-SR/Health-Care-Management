package com.java.health.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class DoctorRegisterRequest {
    private String name;
    private String email;
    private String degree;
    private String specialization;
    private String hospitalName;
    private String hospitalLocation;
    private MultipartFile proof;
}