package com.insurance.dto;

import com.insurance.entity.InsurancePolicy;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsurancePolicyDTO {
    
    
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Long agentId;
    private String agentName;
    private String policyNumber;
    private String policyName;
    private InsurancePolicy.PolicyType type;
    private BigDecimal premium;
    private BigDecimal coverageAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private InsurancePolicy.PolicyStatus status;
    private String description;
    private String benefits;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
