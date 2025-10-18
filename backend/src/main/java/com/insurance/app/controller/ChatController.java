package com.insurance.app.controller;

import com.insurance.app.model.ChatRequest;
import com.insurance.app.model.ChatResponse;
import com.insurance.app.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {
    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        try {
            ChatResponse resp = chatService.sendMessage(request);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ChatResponse("Error: " + e.getMessage()));
        }
    }
}
