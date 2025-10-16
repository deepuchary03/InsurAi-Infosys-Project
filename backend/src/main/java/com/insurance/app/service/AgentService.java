package com.insurance.app.service;

import com.insurance.app.model.Agent;
import com.insurance.app.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgentService {
    @Autowired
    private AgentRepository agentRepository;
    // appointmentRepository is no longer needed; DB-level queries in AgentRepository handle active appointments
    
    public List<Agent> getAllAgents() {
        return agentRepository.findAll();
    }
    
    public Optional<Agent> getAgentById(Long id) {
        return agentRepository.findById(id);
    }
    
    public Agent createAgent(Agent agent) {
        return agentRepository.save(agent);
    }
    
    public Agent updateAgent(Long id, Agent agent) {
        agent.setId(id);
        return agentRepository.save(agent);
    }
    
    public void deleteAgent(Long id) {
        agentRepository.deleteById(id);
    }

    /**
     * Return agents whose availability is 'yes' and who are not already appointed to other customers.
     * If requestingCustomerId is provided, an agent is allowed if they have no active appointments
     * or their only active appointment(s) belong to the requesting customer.
     */
    public List<Agent> getAvailableAgents(Long requestingCustomerId) {
        if (requestingCustomerId == null) {
            // when no requesting customer, return agents that are available and not booked
            return agentRepository.findAvailableAndUnappointedAgents();
        } else {
            // when a requesting customer is provided, show agents visible to that customer
            // (available to all OR booked by this customer)
            return agentRepository.findAgentsVisibleToCustomer(requestingCustomerId);
        }
    }
}
