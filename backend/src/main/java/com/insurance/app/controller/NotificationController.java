package com.insurance.app.controller;

import com.insurance.app.model.Notification;
import com.insurance.app.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }
    
    @GetMapping("/recipient/{recipientId}")
    public List<Notification> getNotificationsByRecipient(@PathVariable Long recipientId) {
        return notificationService.getNotificationsByRecipient(recipientId);
    }
    
    @GetMapping("/pending")
    public List<Notification> getPendingNotifications() {
        return notificationService.getPendingNotifications();
    }
    
    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        try {
            Notification created = notificationService.createNotification(notification);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}