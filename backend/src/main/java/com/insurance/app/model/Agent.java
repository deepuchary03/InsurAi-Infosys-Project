package com.insurance.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "agents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Agent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String specialization;
    private String availability;
    
    // Optional schedule for the agent (e.g. "Mon-Fri 09:00-17:00" or JSON) - will not break existing clients
    private String schedule;
    
    // Additional agent contact details
    private String email;
    private String phone;
    
    // Working hours (e.g., "9:00 AM - 5:00 PM")
    @Column(name = "working_hours")
    private String workingHours;
    
    // Qualifications/certifications
    private String qualifications;
    
    // Years of experience
    @Column(name = "experience_years")
    private Integer experienceYears;
}
