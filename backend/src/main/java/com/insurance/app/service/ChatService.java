package com.insurance.app.service;

import com.insurance.app.model.ChatRequest;
import com.insurance.app.model.ChatResponse;
import com.insurance.app.repository.AgentRepository;
import com.insurance.app.repository.PlanRepository;
import com.insurance.app.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class ChatService {
    
    @Autowired
    private AgentRepository agentRepository;
    
    @Autowired
    private PlanRepository planRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Value("${gemini.api.key:AIzaSyDyeD4ZDlETGXNc3x144pzFMZH0OI54QsI}")
    private String apiKey;
    
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public ChatResponse sendMessage(ChatRequest req) throws IOException, InterruptedException {

        if (apiKey == null || apiKey.isEmpty()) {
            return new ChatResponse("Error: Missing Gemini API key. Please configure it in application.properties.");
        }

        String userMessage = req.getMessage() == null ? "" : req.getMessage();
        
        // First, check if the question requires database information
        String databaseInfo = getRelevantDatabaseInfo(userMessage);
        
        // Build the prompt with context
        String systemPrompt = "You are a helpful support assistant for an insurance website. " +
                "Answer user questions politely and clearly about insurance policies, claims, and appointments. " +
                "Use the following database information to answer questions accurately:\n\n" +
                databaseInfo;

        // Google Gemini API endpoint - using gemini-2.0-flash-001 (free tier, latest model)
        String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=" + apiKey;

        // Build JSON payload for Gemini API
        String payload = "{"
                + "\"contents\":[{"
                + "\"parts\":[{"
                + "\"text\":\"" + escapeJson(systemPrompt + "\n\nUser Question: " + userMessage) + "\""
                + "}]"
                + "}],"
                + "\"generationConfig\":{"
                + "\"temperature\":0.7,"
                + "\"topK\":40,"
                + "\"topP\":0.95,"
                + "\"maxOutputTokens\":1024"
                + "}"
                + "}";

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(geminiUrl))
                .timeout(Duration.ofSeconds(30))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            return parseGeminiResponse(response.body());
        } else {
            return new ChatResponse("AI service error (status=" + response.statusCode() + "): " + response.body());
        }
    }
    
    /**
     * Extract relevant database information based on user query
     */
    private String getRelevantDatabaseInfo(String userMessage) {
        StringBuilder info = new StringBuilder();
        String lowerMessage = userMessage.toLowerCase();
        
        // Check if asking about agents
        if (lowerMessage.contains("agent") || lowerMessage.contains("advisor")) {
            long totalAgents = agentRepository.count();
            long availableAgents = agentRepository.findAll().stream()
                    .filter(agent -> agent.getAvailability() != null && 
                            (agent.getAvailability().equalsIgnoreCase("available") || 
                             agent.getAvailability().equalsIgnoreCase("yes") ||
                             agent.getAvailability().equalsIgnoreCase("true")))
                    .count();
            
            info.append("AGENTS INFORMATION:\n");
            info.append("- Total agents: ").append(totalAgents).append("\n");
            info.append("- Available agents: ").append(availableAgents).append("\n");
            
            // Add agent details
            agentRepository.findAll().forEach(agent -> {
                String status = (agent.getAvailability() != null && 
                               (agent.getAvailability().equalsIgnoreCase("available") || 
                                agent.getAvailability().equalsIgnoreCase("yes") ||
                                agent.getAvailability().equalsIgnoreCase("true"))) 
                               ? "Available" : "Unavailable";
                info.append("  • ").append(agent.getName())
                    .append(" (").append(agent.getSpecialization())
                    .append(") - ").append(status)
                    .append("\n");
            });
        }
        
        // Check if asking about plans
        if (lowerMessage.contains("plan") || lowerMessage.contains("policy") || lowerMessage.contains("insurance")) {
            long totalPlans = planRepository.count();
            info.append("\nINSURANCE PLANS:\n");
            info.append("- Total plans available: ").append(totalPlans).append("\n");
            
            planRepository.findAll().forEach(plan -> {
                info.append("  • ").append(plan.getPlanName())
                    .append(" - $").append(plan.getPrice())
                    .append("/month");
                if (plan.getDescription() != null && !plan.getDescription().isEmpty()) {
                    info.append(" - ").append(plan.getDescription());
                }
                info.append("\n");
            });
        }
        
        // Check if asking about appointments
        if (lowerMessage.contains("appointment") || lowerMessage.contains("meeting")) {
            long totalAppointments = appointmentRepository.count();
            info.append("\nAPPOINTMENTS:\n");
            info.append("- Total appointments scheduled: ").append(totalAppointments).append("\n");
        }
        
        if (info.length() == 0) {
            info.append("General insurance support information available. Ask me about agents, plans, or appointments.\n");
        }
        
        return info.toString();
    }
    
    /**
     * Parse Gemini API response
     */
    private ChatResponse parseGeminiResponse(String body) {
        try {
            // Look for the text content in Gemini's response structure
            int textStart = body.indexOf("\"text\":");
            if (textStart != -1) {
                textStart = body.indexOf("\"", textStart + 7) + 1;
                int textEnd = body.indexOf("\"", textStart);
                
                if (textEnd != -1) {
                    String content = body.substring(textStart, textEnd);
                    content = unescapeJson(content);
                    return new ChatResponse(content);
                }
            }
            return new ChatResponse("I'm here to help! Could you please rephrase your question?");
        } catch (Exception e) {
            return new ChatResponse("I encountered an issue processing your request. Please try again.");
        }
    }

    // 🔹 Escape JSON special characters
    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n");
    }

    // 🔹 Unescape JSON back to normal text
    private static String unescapeJson(String s) {
        if (s == null) return null;
        return s.replaceAll("\\\\n", "\n").replaceAll("\\\\\"", "\"");
    }
}
