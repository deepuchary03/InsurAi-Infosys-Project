package com.insurance.app.service;

import com.insurance.app.model.Appointment;
import com.insurance.app.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;
    
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
        appointment.setStatus("Scheduled");
        return appointmentRepository.save(appointment);
    }
    
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}
