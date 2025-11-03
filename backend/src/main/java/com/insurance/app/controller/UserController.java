package com.insurance.app.controller;

import com.insurance.app.config.JwtUtil;
import com.insurance.app.model.AuthRequest;
import com.insurance.app.model.AuthResponse;
import com.insurance.app.model.User;
import com.insurance.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        String token = jwtUtil.generateToken(createdUser.getUsername(), createdUser.getRole(), createdUser.getId());
        AuthResponse response = new AuthResponse(
            token,
            createdUser.getId(),
            createdUser.getUsername(),
            createdUser.getRole()
        );
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        return userService.login(authRequest.getUsername(), authRequest.getPassword())
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getId());
                     // Log token
                    System.out.println("Generated Token: " + token);
                    AuthResponse response = new AuthResponse(
                        token,
                        user.getId(),
                        user.getUsername(),
                        user.getRole()
                    );
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(401).build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = userService.updateUser(id, user);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        boolean verified = userService.verifyEmail(token);
        
        Map<String, String> response = Map.of(
            "success", String.valueOf(verified),
            "message", verified ? "Email verified successfully" : "Invalid or expired verification token"
        );
        
        return verified ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean initiated = userService.initiatePasswordReset(email);
        
        Map<String, String> response = Map.of(
            "success", String.valueOf(initiated),
            "message", initiated ? "Password reset email sent" : "Email not found"
        );
        
        return initiated ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");
        boolean reset = userService.resetPassword(token, newPassword);
        
        Map<String, String> response = Map.of(
            "success", String.valueOf(reset),
            "message", reset ? "Password reset successfully" : "Invalid or expired reset token"
        );
        
        return reset ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
