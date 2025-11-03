package com.insurance.app.service;

import com.insurance.app.model.Appointment;
import com.insurance.app.model.Agent;
import com.insurance.app.model.User;
import com.insurance.app.repository.AppointmentRepository;
import com.insurance.app.repository.AgentRepository;
import com.insurance.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private AgentRepository agentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;
    
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
    
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }
    
    public List<Appointment> getAppointmentsByCustomerId(Long customerId) {
        return appointmentRepository.findByCustomerId(customerId);
    }
    
    public List<Appointment> getAppointmentsByAgentId(Long agentId) {
        return appointmentRepository.findByAgentId(agentId);
    }
    
    public Appointment createAppointment(Appointment appointment) {
        // Validate appointment time conflicts
        if (hasTimeConflict(appointment)) {
            throw new RuntimeException("Time slot is already booked for this agent");
        }
        
        // Set customer and agent names
        if (appointment.getCustomerId() != null) {
            userRepository.findById(appointment.getCustomerId()).ifPresent(user -> {
                appointment.setCustomerName(user.getFullName() != null ? user.getFullName() : user.getUsername());
            });
        }
        
        if (appointment.getAgentId() != null) {
            agentRepository.findById(appointment.getAgentId()).ifPresent(agent -> {
                appointment.setAgentName(agent.getName());
                // Mark agent as unavailable
                agent.setAvailability("no");
                agentRepository.save(agent);
            });
        }
        
        appointment.setStatus("Scheduled");
        Appointment saved = appointmentRepository.save(appointment);
        
        // Send notification
        notificationService.sendAppointmentConfirmation(saved);
        
        return saved;
    }
    
    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            
            // Check for conflicts if date/time is being changed
            if (!appointment.getAppointmentDate().equals(appointmentDetails.getAppointmentDate()) ||
                (appointmentDetails.getAppointmentTime() != null && 
                 !appointmentDetails.getAppointmentTime().equals(appointment.getAppointmentTime()))) {
                
                Appointment tempAppointment = new Appointment();
                tempAppointment.setAgentId(appointmentDetails.getAgentId() != null ? 
                    appointmentDetails.getAgentId() : appointment.getAgentId());
                tempAppointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
                tempAppointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
                tempAppointment.setId(id); // Exclude current appointment from conflict check
                
                if (hasTimeConflict(tempAppointment)) {
                    throw new RuntimeException("Time slot is already booked for this agent");
                }
            }
            
            if (appointmentDetails.getAppointmentDate() != null) {
                appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
            }
            if (appointmentDetails.getAppointmentTime() != null) {
                appointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
            }
            if (appointmentDetails.getReason() != null) {
                appointment.setReason(appointmentDetails.getReason());
            }
            if (appointmentDetails.getNotes() != null) {
                appointment.setNotes(appointmentDetails.getNotes());
            }
            if (appointmentDetails.getStatus() != null) {
                appointment.setStatus(appointmentDetails.getStatus());
                
                // If appointment is cancelled, make agent available again
                if ("Cancelled".equalsIgnoreCase(appointmentDetails.getStatus())) {
                    agentRepository.findById(appointment.getAgentId()).ifPresent(agent -> {
                        agent.setAvailability("yes");
                        agentRepository.save(agent);
                    });
                    
                    // Send cancellation notification
                    notificationService.sendAppointmentCancellation(appointment);
                }
            }
            
            return appointmentRepository.save(appointment);
        }
        return null;
    }
    
    private boolean hasTimeConflict(Appointment newAppointment) {
        List<Appointment> existingAppointments = appointmentRepository
            .findByAgentIdAndAppointmentDateAndStatusNot(
                newAppointment.getAgentId(), 
                newAppointment.getAppointmentDate(),
                "Cancelled"
            );
        
        // If no time specified, check for any appointment on that date
        if (newAppointment.getAppointmentTime() == null || newAppointment.getAppointmentTime().isEmpty()) {
            return existingAppointments.stream()
                .anyMatch(apt -> apt.getId() == null || !apt.getId().equals(newAppointment.getId()));
        }
        
        // Check for exact time conflicts
        return existingAppointments.stream()
            .filter(apt -> apt.getId() == null || !apt.getId().equals(newAppointment.getId()))
            .anyMatch(apt -> apt.getAppointmentTime() != null && 
                           apt.getAppointmentTime().equals(newAppointment.getAppointmentTime()));
    }
    
    public void deleteAppointment(Long id) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            
            // Make agent available again
            if (appointment.getAgentId() != null) {
                agentRepository.findById(appointment.getAgentId()).ifPresent(agent -> {
                    agent.setAvailability("yes");
                    agentRepository.save(agent);
                });
            }
            
            // Send cancellation notification
            notificationService.sendAppointmentCancellation(appointment);
        }
        
        appointmentRepository.deleteById(id);
    }
}
