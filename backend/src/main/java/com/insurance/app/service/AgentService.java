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
}
