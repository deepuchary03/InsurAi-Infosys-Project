package com.insurance.app.controller;

import com.insurance.app.model.ChatRequest;
import com.insurance.app.model.ChatResponse;
import com.insurance.app.service.ChatService;
import com.insurance.app.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {
    @Autowired
    private ChatService chatService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        try {
            ChatResponse resp = chatService.sendMessage(request);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ChatResponse("Error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/voice")
    public ResponseEntity<ChatResponse> processVoice(@RequestBody Map<String, Object> request, HttpServletRequest httpRequest) {
        try {
            String voiceText = (String) request.get("voiceText");
            if (voiceText == null || voiceText.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ChatResponse("Voice text is required"));
            }
            
            // Debug logging
            System.out.println("=== VOICE BOOKING BACKEND DEBUG ===");
            System.out.println("Received request: " + request);
            System.out.println("Voice text: " + voiceText);
            System.out.println("Raw userId: " + request.get("userId"));
            
            // Extract userId if provided
            Long userId = null;
            if (request.get("userId") != null) {
                if (request.get("userId") instanceof Number) {
                    userId = ((Number) request.get("userId")).longValue();
                } else {
                    try {
                        userId = Long.parseLong(request.get("userId").toString());
                    } catch (NumberFormatException e) {
                        System.out.println("Failed to parse userId: " + e.getMessage());
                    }
                }
            }
            
            // Fallback: Try to extract user ID from JWT token if not provided
            if (userId == null) {
                String authHeader = httpRequest.getHeader("Authorization");
                System.out.println("Authorization header: " + authHeader);
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    try {
                        String username = jwtUtil.extractUsername(token);
                        System.out.println("Extracted username from JWT: " + username);
                        
                        // Extract user ID from JWT token claims
                        if (jwtUtil.validateToken(token, username)) {
                            // Try to get userId from token claims
                            String userIdFromToken = jwtUtil.extractUserId(token);
                            if (userIdFromToken != null) {
                                try {
                                    userId = Long.parseLong(userIdFromToken);
                                    System.out.println("Extracted userId from JWT claims: " + userId);
                                } catch (NumberFormatException e) {
                                    System.out.println("Failed to parse userId from JWT: " + e.getMessage());
                                }
                            }
                        }
                    } catch (Exception e) {
                        System.out.println("Failed to extract user from JWT: " + e.getMessage());
                    }
                }
            }
            
            System.out.println("Final userId: " + userId);
            
            ChatRequest chatRequest = new ChatRequest();
            chatRequest.setMessage(voiceText);
            chatRequest.setUserId(userId);
            
            ChatResponse resp = chatService.sendMessage(chatRequest);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ChatResponse("Error processing voice input: " + e.getMessage()));
        }
    }
}
