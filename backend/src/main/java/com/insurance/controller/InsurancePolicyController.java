package com.insurance.controller;

import com.insurance.dto.InsurancePolicyDTO;
import com.insurance.dto.PolicyPurchaseRequest;
import com.insurance.service.InsurancePolicyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/policies")
@CrossOrigin(origins = "*")
public class InsurancePolicyController {
    
    @Autowired
    private InsurancePolicyService policyService;
    
    @PostMapping("/purchase")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<InsurancePolicyDTO> purchasePolicy(
            @Valid @RequestBody PolicyPurchaseRequest request) {
        InsurancePolicyDTO policy = policyService.purchasePolicy(request);
        return ResponseEntity.ok(policy);
    }
    
    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<List<InsurancePolicyDTO>> getPoliciesByCustomer(
            @PathVariable Long customerId) {
        List<InsurancePolicyDTO> policies = policyService.getPoliciesByCustomer(customerId);
        return ResponseEntity.ok(policies);
    }
    
    @GetMapping("/agent/{agentId}")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<List<InsurancePolicyDTO>> getPoliciesByAgent(
            @PathVariable Long agentId) {
        List<InsurancePolicyDTO> policies = policyService.getPoliciesByAgent(agentId);
        return ResponseEntity.ok(policies);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InsurancePolicyDTO>> getAllPolicies() {
        List<InsurancePolicyDTO> policies = policyService.getAllPolicies();
        return ResponseEntity.ok(policies);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<InsurancePolicyDTO> getPolicyById(@PathVariable Long id) {
        InsurancePolicyDTO policy = policyService.getPolicyById(id);
        return ResponseEntity.ok(policy);
    }
    
    @GetMapping("/number/{policyNumber}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<InsurancePolicyDTO> getPolicyByNumber(
            @PathVariable String policyNumber) {
        InsurancePolicyDTO policy = policyService.getPolicyByNumber(policyNumber);
        return ResponseEntity.ok(policy);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<InsurancePolicyDTO> updatePolicy(
            @PathVariable Long id,
            @Valid @RequestBody PolicyPurchaseRequest request) {
        InsurancePolicyDTO policy = policyService.updatePolicy(id, request);
        return ResponseEntity.ok(policy);
    }
    
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'AGENT', 'ADMIN')")
    public ResponseEntity<Map<String, String>> cancelPolicy(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String reason = request.getOrDefault("reason", "No reason provided");
        policyService.cancelPolicy(id, reason);
        return ResponseEntity.ok(Map.of("message", "Policy cancelled successfully"));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }
}
