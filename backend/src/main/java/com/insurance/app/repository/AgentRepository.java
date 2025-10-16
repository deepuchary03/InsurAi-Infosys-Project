package com.insurance.app.repository;

import com.insurance.app.model.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {

    /**
     * Agents with availability = 'yes' and no active appointments (status != 'cancelled').
     */
//     @Query("SELECT a FROM Agent a " +
//            "WHERE LOWER(a.availability) = 'yes' " +
//            "AND a.id NOT IN (" +
//            "   SELECT ap.agentId FROM Appointment ap " +
//            "   WHERE LOWER(ap.status) <> 'cancelled'" +
//            ")")
@Query("SELECT a FROM Agent a WHERE LOWER(a.availability) = 'yes' AND a.id NOT IN (SELECT ap.agentId FROM Appointment ap WHERE LOWER(ap.status) <> 'cancelled')")

//  @Query("SELECT a FROM Agent a WHERE LOWER(a.availability) = 'yes'")
    List<Agent> findAvailableAndUnappointedAgents();

    /**
     * Agents with availability = 'yes' and no active appointments by other customers.
     * This allows agents whose only active appointments belong to the requesting customer.
     */
//     @Query("SELECT a FROM Agent a " +
//            "WHERE LOWER(a.availability) = 'yes' " +
//            "AND a.id NOT IN (" +
//            "   SELECT ap.agentId FROM Appointment ap " +
//            "   WHERE LOWER(ap.status) <> 'cancelled' " +
//            "     AND ap.customerId <> :customerId" +
//            ")")
@Query("SELECT a FROM Agent a WHERE LOWER(a.availability) = 'yes' AND a.id NOT IN (SELECT ap.agentId FROM Appointment ap WHERE LOWER(ap.status) <> 'cancelled' AND ap.customerId <> :customerId)")


//  @Query("SELECT a FROM Agent a WHERE LOWER(a.availability) = 'yes'")
    List<Agent> findAvailableAgentsAllowingCustomer(@Param("customerId") Long customerId);

    /**
     * Agents visible to a specific customer:
     * - Agents with availability = 'yes' and not actively appointed to other customers
     * OR
     * - Agents that have an active appointment (status != 'cancelled') belonging to the requesting customer
     */
//     @Query("SELECT a FROM Agent a " +
//            "WHERE (" +
//            "   LOWER(a.availability) = 'yes' " +
//            "   AND a.id NOT IN (" +
//            "       SELECT ap.agentId FROM Appointment ap " +
//            "       WHERE LOWER(ap.status) <> 'cancelled' " +
//            "         AND ap.customerId <> :customerId" +
//            "   )" +
//            ") " +
//            "OR a.id IN (" +
//            "   SELECT ap2.agentId FROM Appointment ap2 " +
//            "   WHERE LOWER(ap2.status) <> 'cancelled' " +
//            "     AND ap2.customerId = :customerId" +
//            ")")
@Query("SELECT a FROM Agent a WHERE (LOWER(a.availability) = 'yes' AND a.id NOT IN (SELECT ap.agentId FROM Appointment ap WHERE LOWER(ap.status) <> 'cancelled' AND ap.customerId <> :customerId)) OR a.id IN (SELECT ap2.agentId FROM Appointment ap2 WHERE LOWER(ap2.status) <> 'cancelled' AND ap2.customerId = :customerId)")

//  @Query("SELECT a FROM Agent a WHERE LOWER(a.availability) = 'yes'")
    List<Agent> findAgentsVisibleToCustomer(@Param("customerId") Long customerId);
}
