package com.insurance.app.controller;

import com.insurance.app.model.User;
import com.insurance.app.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class EmailTestController {
    
    @Autowired
    private NotificationService notificationService;
    
    @PostMapping("/send-test-email")
    public ResponseEntity<Map<String, String>> sendTestEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.get("name");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", "false",
                    "message", "Email address is required"
                ));
            }
            
            // Create a test user for email verification
            User testUser = new User();
            testUser.setId(999L); // Test ID
            testUser.setEmail(email);
            testUser.setFullName(name != null ? name : "Test User");
            testUser.setUsername("testuser");
            
            // Generate a test verification token
            String testToken = UUID.randomUUID().toString();
            
            // Send test email verification
            notificationService.sendEmailVerification(testUser, testToken);
            
            return ResponseEntity.ok(Map.of(
                "success", "true",
                "message", "Test email sent successfully! Check your inbox and console logs.",
                "email", email
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", "false",
                "message", "Failed to send test email: " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/send-test-password-reset")
    public ResponseEntity<Map<String, String>> sendTestPasswordReset(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.get("name");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", "false",
                    "message", "Email address is required"
                ));
            }
            
            // Create a test user for password reset
            User testUser = new User();
            testUser.setId(999L); // Test ID
            testUser.setEmail(email);
            testUser.setFullName(name != null ? name : "Test User");
            testUser.setUsername("testuser");
            
            // Generate a test reset token
            String testToken = UUID.randomUUID().toString();
            
            // Send test password reset email
            notificationService.sendPasswordReset(testUser, testToken);
            
            return ResponseEntity.ok(Map.of(
                "success", "true",
                "message", "Test password reset email sent successfully! Check your inbox and console logs.",
                "email", email
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", "false",
                "message", "Failed to send test email: " + e.getMessage()
            ));
        }
    }
}