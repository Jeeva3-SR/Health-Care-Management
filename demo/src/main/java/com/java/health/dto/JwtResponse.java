package com.java.health.dto;

public class JwtResponse {
    private String token;
    private String username;
    private String role;
    private boolean requiresPasswordChange;

    public JwtResponse() {}

    public JwtResponse(String token, String username, String role, boolean requiresPasswordChange) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.requiresPasswordChange = requiresPasswordChange;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isRequiresPasswordChange() { return requiresPasswordChange; }
    public void setRequiresPasswordChange(boolean requiresPasswordChange) { this.requiresPasswordChange = requiresPasswordChange; }
}