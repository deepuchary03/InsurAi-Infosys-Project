package com.insurance.app.service;

import com.insurance.app.model.Notification;
import com.insurance.app.model.Appointment;
import com.insurance.app.model.User;
import com.insurance.app.model.Agent;
import com.insurance.app.repository.NotificationRepository;
import com.insurance.app.repository.UserRepository;
import com.insurance.app.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AgentRepository agentRepository;
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${app.email.from:noreply@insuranceapp.com}")
    private String fromEmail;
    
    @Value("${app.email.fromName:InsurAI Support}")
    private String fromName;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
    
    public List<Notification> getNotificationsByRecipient(Long recipientId) {
        return notificationRepository.findByRecipientId(recipientId);
    }
    
    public List<Notification> getPendingNotifications() {
        return notificationRepository.findByStatus("PENDING");
    }
    
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
    
    public void sendAppointmentConfirmation(Appointment appointment) {
        try {
            // Send notification to customer
            Optional<User> customer = userRepository.findById(appointment.getCustomerId());
            Optional<Agent> agent = agentRepository.findById(appointment.getAgentId());
            
            if (customer.isPresent() && agent.isPresent()) {
                String subject = "Appointment Confirmation";
                String message = String.format(
                    "Dear %s,\n\n" +
                    "Your appointment has been confirmed with the following details:\n" +
                    "Agent: %s\n" +
                    "Date: %s\n" +
                    "Time: %s\n" +
                    "Reason: %s\n\n" +
                    "Thank you for choosing our services!\n\n" +
                    "Best regards,\n" +
                    "Insurance Team",
                    customer.get().getFullName() != null ? customer.get().getFullName() : customer.get().getUsername(),
                    agent.get().getName(),
                    appointment.getAppointmentDate(),
                    appointment.getAppointmentTime() != null ? appointment.getAppointmentTime() : "Not specified",
                    appointment.getReason() != null ? appointment.getReason() : "General consultation"
                );
                
                Notification customerNotification = new Notification();
                customerNotification.setRecipientId(customer.get().getId());
                customerNotification.setRecipientEmail(customer.get().getEmail());
                customerNotification.setNotificationType("EMAIL");
                customerNotification.setSubject(subject);
                customerNotification.setMessage(message);
                customerNotification.setAppointmentId(appointment.getId());
                
                createNotification(customerNotification);
                sendEmailNotification(customerNotification);
                
                // Send notification to agent
                String agentSubject = "New Appointment Scheduled";
                String agentMessage = String.format(
                    "Dear %s,\n\n" +
                    "A new appointment has been scheduled with you:\n" +
                    "Customer: %s\n" +
                    "Date: %s\n" +
                    "Time: %s\n" +
                    "Reason: %s\n\n" +
                    "Please prepare accordingly.\n\n" +
                    "Best regards,\n" +
                    "Insurance Team",
                    agent.get().getName(),
                    customer.get().getFullName() != null ? customer.get().getFullName() : customer.get().getUsername(),
                    appointment.getAppointmentDate(),
                    appointment.getAppointmentTime() != null ? appointment.getAppointmentTime() : "Not specified",
                    appointment.getReason() != null ? appointment.getReason() : "General consultation"
                );
                
                Notification agentNotification = new Notification();
                agentNotification.setRecipientEmail(agent.get().getEmail());
                agentNotification.setNotificationType("EMAIL");
                agentNotification.setSubject(agentSubject);
                agentNotification.setMessage(agentMessage);
                agentNotification.setAppointmentId(appointment.getId());
                
                createNotification(agentNotification);
                sendEmailNotification(agentNotification);
            }
        } catch (Exception e) {
            System.err.println("Error sending appointment confirmation: " + e.getMessage());
        }
    }
    
    public void sendAppointmentCancellation(Appointment appointment) {
        try {
            Optional<User> customer = userRepository.findById(appointment.getCustomerId());
            Optional<Agent> agent = agentRepository.findById(appointment.getAgentId());
            
            if (customer.isPresent() && agent.isPresent()) {
                String subject = "Appointment Cancelled";
                String message = String.format(
                    "Dear %s,\n\n" +
                    "Your appointment scheduled for %s with %s has been cancelled.\n\n" +
                    "If you need to reschedule, please contact us.\n\n" +
                    "Best regards,\n" +
                    "Insurance Team",
                    customer.get().getFullName() != null ? customer.get().getFullName() : customer.get().getUsername(),
                    appointment.getAppointmentDate(),
                    agent.get().getName()
                );
                
                Notification notification = new Notification();
                notification.setRecipientId(customer.get().getId());
                notification.setRecipientEmail(customer.get().getEmail());
                notification.setNotificationType("EMAIL");
                notification.setSubject(subject);
                notification.setMessage(message);
                notification.setAppointmentId(appointment.getId());
                
                createNotification(notification);
                sendEmailNotification(notification);
            }
        } catch (Exception e) {
            System.err.println("Error sending cancellation notification: " + e.getMessage());
        }
    }
    
    public void sendEmailVerification(User user, String verificationToken) {
        try {
            String subject = "Email Verification Required - InsurAI";
            String message = String.format(
                "Dear %s,\n\n" +
                "Thank you for registering with InsurAI!\n\n" +
                "To verify your email address, please click the link below:\n" +
                "%s/verify-email?token=%s\n\n" +
                "This link will expire in 24 hours for security reasons.\n\n" +
                "If you didn't create this account, please ignore this email.\n\n" +
                "Best regards,\n" +
                "InsurAI Support Team",
                user.getFullName() != null ? user.getFullName() : user.getUsername(),
                frontendUrl,
                verificationToken
            );
            
            Notification notification = new Notification();
            notification.setRecipientId(user.getId());
            notification.setRecipientEmail(user.getEmail());
            notification.setNotificationType("EMAIL");
            notification.setSubject(subject);
            notification.setMessage(message);
            
            createNotification(notification);
            sendEmailNotification(notification);
        } catch (Exception e) {
            System.err.println("Error sending email verification: " + e.getMessage());
        }
    }
    
    public void sendPasswordReset(User user, String resetToken) {
        try {
            String subject = "Password Reset Request - InsurAI";
            String message = String.format(
                "Dear %s,\n\n" +
                "You have requested to reset your password for your InsurAI account.\n\n" +
                "Click the link below to reset your password:\n" +
                "%s/reset-password?token=%s\n\n" +
                "This link will expire in 1 hour for security reasons.\n\n" +
                "If you didn't request this password reset, please ignore this email. Your account remains secure.\n\n" +
                "Best regards,\n" +
                "InsurAI Support Team",
                user.getFullName() != null ? user.getFullName() : user.getUsername(),
                frontendUrl,
                resetToken
            );
            
            Notification notification = new Notification();
            notification.setRecipientId(user.getId());
            notification.setRecipientEmail(user.getEmail());
            notification.setNotificationType("EMAIL");
            notification.setSubject(subject);
            notification.setMessage(message);
            
            createNotification(notification);
            sendEmailNotification(notification);
        } catch (Exception e) {
            System.err.println("Error sending password reset: " + e.getMessage());
        }
    }
    
    private void sendEmailNotification(Notification notification) {
        try {
            if (notification.getRecipientEmail() == null || notification.getRecipientEmail().trim().isEmpty()) {
                notification.setStatus("FAILED");
                notification.setErrorMessage("Recipient email missing");
                notificationRepository.save(notification);
                return;
            }

            if (mailSender != null) {
                // Send actual email using JavaMailSender
                try {
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                    
                    helper.setFrom(fromEmail, fromName);
                    helper.setTo(notification.getRecipientEmail());
                    helper.setSubject(notification.getSubject());
                    helper.setText(notification.getMessage(), false); // false = plain text
                    
                    mailSender.send(message);
                    
                    notification.setStatus("SENT");
                    notification.setSentAt(LocalDateTime.now());
                    System.out.println("✅ Email sent successfully to: " + notification.getRecipientEmail());
                    
                } catch (MessagingException e) {
                    notification.setStatus("FAILED");
                    notification.setErrorMessage("Email sending failed: " + e.getMessage());
                    System.err.println("❌ Failed to send email: " + e.getMessage());
                }
            } else {
                // Fallback: Log email content if JavaMailSender is not configured
                System.out.println("=== EMAIL NOTIFICATION (SMTP NOT CONFIGURED) ===");
                System.out.println("From: " + fromName + " <" + fromEmail + ">");
                System.out.println("To: " + notification.getRecipientEmail());
                System.out.println("Subject: " + notification.getSubject());
                System.out.println("Message: " + notification.getMessage());
                System.out.println("===============================================");
                
                notification.setStatus("SENT");
                notification.setSentAt(LocalDateTime.now());
                notification.setErrorMessage("Email logged (SMTP not configured)");
            }
            
            notificationRepository.save(notification);
            
        } catch (Exception e) {
            notification.setStatus("FAILED");
            notification.setErrorMessage("Unexpected error: " + e.getMessage());
            notificationRepository.save(notification);
            System.err.println("❌ Unexpected error sending email: " + e.getMessage());
        }
    }
}