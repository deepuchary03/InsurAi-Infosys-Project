package com.insurance.dto;

import com.insurance.entity.InsurancePolicy;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyPurchaseRequest {
    
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    private Long agentId; // Optional - can be assigned later
    
    @NotNull(message = "Policy name is required")
    private String policyName;
    
    @NotNull(message = "Policy type is required")
    private InsurancePolicy.PolicyType type;
    
    @NotNull(message = "Premium is required")
    private BigDecimal premium;
    
    @NotNull(message = "Coverage amount is required")
    private BigDecimal coverageAmount;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    private Integer durationMonths; // Will calculate endDate from this
    
    private String description;
    private String benefits;
}
