package com.insurance.app.controller;

import com.insurance.app.model.Appointment;
import com.insurance.app.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;
    
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/customer/{customerId}")
    public List<Appointment> getAppointmentsByCustomerId(@PathVariable Long customerId) {
        return appointmentService.getAppointmentsByCustomerId(customerId);
    }
    
    @GetMapping("/agent/{agentId}")
    public List<Appointment> getAppointmentsByAgentId(@PathVariable Long agentId) {
        return appointmentService.getAppointmentsByAgentId(agentId);
    }
    
    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return appointmentService.createAppointment(appointment);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }
}
