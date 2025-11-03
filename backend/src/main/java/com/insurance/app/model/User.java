package com.insurance.app.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    
    private String role;
    
    // Email verification fields
    @Column(unique = true)
    private String email;
    
    @Column(name = "email_verified")
    private Boolean emailVerified = false;
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "verification_token")
    private String verificationToken;
    
    // Password reset fields
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "reset_token")
    private String resetToken;
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;
    
    // Additional user information
    private String fullName;
    private String phone;
}
