package com.insurance.app.repository;

import com.insurance.app.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomerId(Long customerId);
    List<Appointment> findByAgentId(Long agentId);
    // find appointments for an agent with status not equal to 'cancelled' (treat other statuses as active)
    List<Appointment> findByAgentIdAndStatusNot(Long agentId, String status);
    List<Appointment> findByAgentIdAndAppointmentDateAndStatusNot(Long agentId, String appointmentDate, String status);
}
