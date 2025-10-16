package com.insurance.app.controller;

import com.insurance.app.model.Agent;
import com.insurance.app.service.AgentService;
import com.insurance.app.repository.AppointmentRepository;
import com.insurance.app.repository.AgentRepository;
import com.insurance.app.model.Appointment;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
@CrossOrigin(origins = "*")
public class AgentController {
    @Autowired
    private AgentService agentService;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private AgentRepository agentRepository;
    
    @GetMapping("/available")
    public List<Agent> getAvailableAgents(@RequestParam(required = false) Long customerId) {
        return agentService.getAvailableAgents(customerId);
    }

    /**
     * Debug endpoint: returns agents with normalized availability and active appointments.
     * Useful to trace why an agent is being shown to customers.
     */
    @GetMapping("/debug-visible")
    public List<Map<String, Object>> debugAgents(@RequestParam(required = false) Long customerId) {
        List<Agent> all = agentRepository.findAll();
        List<Map<String, Object>> out = new java.util.ArrayList<>();
        for (Agent a : all) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", a.getId());
            m.put("name", a.getName());
            String norm = a.getAvailability() == null ? "" : a.getAvailability().trim().toLowerCase();
            m.put("availabilityRaw", a.getAvailability());
            m.put("availabilityNormalized", norm);
            List<Appointment> active = appointmentRepository.findByAgentIdAndStatusNot(a.getId(), "cancelled");
            m.put("activeAppointmentsCount", active == null ? 0 : active.size());
            m.put("activeAppointments", active);
            // visible according to current service logic
            boolean visible;
            if (customerId == null) {
                visible = "yes".equals(norm) && (active == null || active.isEmpty());
            } else {
                // visible if available and not booked by others OR booked by this customer
                boolean availableAndUnbookedByOthers = "yes".equals(norm) && agentService.getAvailableAgents(customerId).stream().anyMatch(ag -> ag.getId().equals(a.getId()));
                boolean bookedByThisCustomer = active != null && active.stream().allMatch(ap -> customerId.equals(ap.getCustomerId()));
                visible = availableAndUnbookedByOthers || bookedByThisCustomer;
            }
            m.put("visibleToRequestingCustomer", visible);
            out.add(m);
        }
        return out;
    }

    @GetMapping
    public List<Agent> getAllAgents() {
        return agentService.getAllAgents();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Agent> getAgentById(@PathVariable Long id) {
        return agentService.getAgentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Agent createAgent(@RequestBody Agent agent) {
        return agentService.createAgent(agent);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Agent> updateAgent(@PathVariable Long id, @RequestBody Agent agent) {
        return ResponseEntity.ok(agentService.updateAgent(id, agent));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgent(@PathVariable Long id) {
        agentService.deleteAgent(id);
        return ResponseEntity.ok().build();
    }
}
