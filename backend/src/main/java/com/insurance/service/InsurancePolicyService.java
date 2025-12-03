package com.insurance.service;

import com.insurance.dto.InsurancePolicyDTO;
import com.insurance.dto.PolicyPurchaseRequest;
import com.insurance.entity.Agent;
import com.insurance.entity.InsurancePolicy;
import com.insurance.entity.User;
import com.insurance.repository.AgentRepository;
import com.insurance.repository.InsurancePolicyRepository;
import com.insurance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InsurancePolicyService {
    
    @Autowired
    private InsurancePolicyRepository policyRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AgentRepository agentRepository;
    
    @Transactional
    public InsurancePolicyDTO purchasePolicy(PolicyPurchaseRequest request) {
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        Agent agent = null;
        if (request.getAgentId() != null) {
            agent = agentRepository.findById(request.getAgentId())
                    .orElse(null);
        }
        
        // Calculate end date
        LocalDate endDate = request.getStartDate().plusMonths(
                request.getDurationMonths() != null ? request.getDurationMonths() : 12
        );
        
        // Generate unique policy number
        String policyNumber = generatePolicyNumber(request.getType());
        
        InsurancePolicy policy = InsurancePolicy.builder()
                .customer(customer)
                .agent(agent)
                .policyNumber(policyNumber)
                .policyName(request.getPolicyName())
                .type(request.getType())
                .premium(request.getPremium())
                .coverageAmount(request.getCoverageAmount())
                .startDate(request.getStartDate())
                .endDate(endDate)
                .status(InsurancePolicy.PolicyStatus.ACTIVE)
                .description(request.getDescription())
                .benefits(request.getBenefits())
                .build();
        
        InsurancePolicy savedPolicy = policyRepository.save(policy);
        return convertToDTO(savedPolicy);
    }
    
    public List<InsurancePolicyDTO> getPoliciesByCustomer(Long customerId) {
        return policyRepository.findByCustomerId(customerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<InsurancePolicyDTO> getPoliciesByAgent(Long agentId) {
        return policyRepository.findByAgentId(agentId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<InsurancePolicyDTO> getAllPolicies() {
        return policyRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public InsurancePolicyDTO getPolicyById(Long id) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));
        return convertToDTO(policy);
    }
    
    public InsurancePolicyDTO getPolicyByNumber(String policyNumber) {
        InsurancePolicy policy = policyRepository.findByPolicyNumber(policyNumber)
                .orElseThrow(() -> new RuntimeException("Policy not found"));
        return convertToDTO(policy);
    }
    
    @Transactional
    public InsurancePolicyDTO updatePolicy(Long id, PolicyPurchaseRequest request) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));
        
        if (request.getPolicyName() != null) {
            policy.setPolicyName(request.getPolicyName());
        }
        if (request.getType() != null) {
            policy.setType(request.getType());
        }
        if (request.getPremium() != null) {
            policy.setPremium(request.getPremium());
        }
        if (request.getCoverageAmount() != null) {
            policy.setCoverageAmount(request.getCoverageAmount());
        }
        if (request.getDescription() != null) {
            policy.setDescription(request.getDescription());
        }
        if (request.getBenefits() != null) {
            policy.setBenefits(request.getBenefits());
        }
        if (request.getAgentId() != null) {
            Agent agent = agentRepository.findById(request.getAgentId()).orElse(null);
            policy.setAgent(agent);
        }
        
        InsurancePolicy updatedPolicy = policyRepository.save(policy);
        return convertToDTO(updatedPolicy);
    }
    
    @Transactional
    public void cancelPolicy(Long id, String reason) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));
        policy.setStatus(InsurancePolicy.PolicyStatus.CANCELLED);
        policy.setDescription(policy.getDescription() + "\nCancellation Reason: " + reason);
        policyRepository.save(policy);
    }
    
    @Transactional
    public void deletePolicy(Long id) {
        policyRepository.deleteById(id);
    }
    
    private String generatePolicyNumber(InsurancePolicy.PolicyType type) {
        String prefix = switch (type) {
            case LIFE -> "LIF";
            case HEALTH -> "HLT";
            case AUTO -> "AUT";
            case HOME -> "HOM";
            case BUSINESS -> "BUS";
            case TRAVEL -> "TRV";
            case DISABILITY -> "DIS";
        };
        
        String uuid = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return prefix + "-" + uuid;
    }
    
    private InsurancePolicyDTO convertToDTO(InsurancePolicy policy) {
        return InsurancePolicyDTO.builder()
                .id(policy.getId())
                .customerId(policy.getCustomer().getId())
                .customerName(policy.getCustomer().getFullName())
                .customerEmail(policy.getCustomer().getEmail())
                .agentId(policy.getAgent() != null ? policy.getAgent().getId() : null)
                .agentName(policy.getAgent() != null ? policy.getAgent().getUser().getFullName() : null)
                .policyNumber(policy.getPolicyNumber())
                .policyName(policy.getPolicyName())
                .type(policy.getType())
                .premium(policy.getPremium())
                .coverageAmount(policy.getCoverageAmount())
                .startDate(policy.getStartDate())
                .endDate(policy.getEndDate())
                .status(policy.getStatus())
                .description(policy.getDescription())
                .benefits(policy.getBenefits())
                .createdAt(policy.getCreatedAt())
                .updatedAt(policy.getUpdatedAt())
                .build();
    }
}
