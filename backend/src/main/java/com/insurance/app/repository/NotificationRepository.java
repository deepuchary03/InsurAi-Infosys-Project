package com.insurance.app.repository;

import com.insurance.app.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientId(Long recipientId);
    List<Notification> findByStatus(String status);
    List<Notification> findByAppointmentId(Long appointmentId);
    List<Notification> findByRecipientIdAndStatus(Long recipientId, String status);
    List<Notification> findByNotificationType(String notificationType);
}
