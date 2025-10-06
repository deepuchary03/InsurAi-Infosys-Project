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
        String token = jwtUtil.generateToken(createdUser.getUsername(), createdUser.getRole());
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
                    String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
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
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
