package com.insurance.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class EmailConfig {

    @Value("${spring.mail.host:}")
    private String host;

    @Value("${spring.mail.port:587}")
    private int port;

    @Value("${spring.mail.username:}")
    private String username;

    @Value("${spring.mail.password:}")
    private String password;

    @Bean
    public JavaMailSender getJavaMailSender() {
        // Only create JavaMailSender if SMTP is properly configured
        if (host == null || host.trim().isEmpty() || 
            username == null || username.trim().isEmpty()) {
            System.out.println("⚠️  SMTP not configured. Emails will be logged to console.");
            System.out.println("   To enable email sending, configure SMTP settings in application.properties");
            return null; // Return null to disable email sending
        }

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        
        mailSender.setUsername(username);
        mailSender.setPassword(password);
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "false"); // Set to true for debugging
        
        System.out.println("✅ SMTP configured successfully for: " + username);
        return mailSender;
    }
}