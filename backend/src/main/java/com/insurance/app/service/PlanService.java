package com.insurance.app.service;

import com.insurance.app.model.Plan;
import com.insurance.app.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlanService {
    @Autowired
    private PlanRepository planRepository;
    
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }
    
    public Optional<Plan> getPlanById(Long id) {
        return planRepository.findById(id);
    }
    
    public Plan createPlan(Plan plan) {
        return planRepository.save(plan);
    }
    
    public Plan updatePlan(Long id, Plan plan) {
        plan.setId(id);
        return planRepository.save(plan);
    }
    
    public void deletePlan(Long id) {
        planRepository.deleteById(id);
    }
}
