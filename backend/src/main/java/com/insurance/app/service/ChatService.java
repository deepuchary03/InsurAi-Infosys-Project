package com.insurance.app.service;

import com.insurance.app.model.ChatRequest;
import com.insurance.app.model.ChatResponse;
import com.insurance.app.model.Appointment;
import com.insurance.app.model.Agent;
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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatService {

    @Autowired
    private AgentRepository agentRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    // ✅ Loaded from .env via application.properties
    @Value("${gemini.api.key}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public ChatResponse sendMessage(ChatRequest req) throws IOException, InterruptedException {

        if (apiKey == null || apiKey.isEmpty()) {
            return new ChatResponse("Error: Missing Gemini API key. Please configure it in application.properties or .env.");
        }

        String userMessage = req.getMessage() == null ? "" : req.getMessage();

        // Check for appointment booking intent
        ChatResponse appointmentResponse = checkAppointmentBookingIntent(userMessage, req.getUserId());
        if (appointmentResponse != null) {
            return appointmentResponse;
        }

        // Database context
        String databaseInfo = getRelevantDatabaseInfo(userMessage);

        // System prompt
        String systemPrompt = "You are a helpful support assistant for an insurance website called InsurAI. "
                + "Answer user questions politely and clearly about insurance policies, claims, and appointments. "
                + "For appointment booking, guide users to use commands like: "
                + "'Book appointment with [agent name] on [date] at [time]' or "
                + "'I want to book an appointment with a life insurance agent tomorrow at 2 PM'. "
                + "Use the following database information:\n\n"
                + databaseInfo;

        String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/"
                + "gemini-2.0-flash-001:generateContent?key=" + apiKey;

        // Request body
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

    public ChatResponse processVoiceMessage(String voiceText) throws IOException, InterruptedException {
        ChatRequest voiceRequest = new ChatRequest();
        voiceRequest.setMessage(voiceText);
        return sendMessage(voiceRequest);
    }

    // -------------------- Appointment logic --------------------

    private ChatResponse checkAppointmentBookingIntent(String message, Long userId) {
        String lower = message.toLowerCase();

        boolean isBooking = lower.contains("book") && lower.contains("appointment")
                || lower.contains("schedule") && (lower.contains("meeting") || lower.contains("appointment"))
                || lower.contains("want to meet")
                || lower.contains("make an appointment")
                || lower.contains("book a slot");

        if (!isBooking) return null;

        userId = 2L; // Forced booking user for testing
        System.out.println("FORCE BOOKING: Using userId " + userId);

        try {
            AppointmentDetails details = extractAppointmentDetails(message);

            if (details.agentName == null && details.specialization == null) {
                List<Agent> availableAgents = agentRepository.findAll().stream()
                        .filter(a -> "yes".equalsIgnoreCase(a.getAvailability()))
                        .toList();

                if (availableAgents.isEmpty()) {
                    return new ChatResponse("Sorry, no agents are currently available. Please try again later.");
                }

                StringBuilder response = new StringBuilder("I can help you book an appointment! Available agents:\n\n");
                for (Agent agent : availableAgents) {
                    response.append("• ").append(agent.getName())
                            .append(" - ").append(agent.getSpecialization())
                            .append(" (").append(agent.getWorkingHours()).append(")\n");
                }
                response.append("\nExample: 'Book appointment with ")
                        .append(availableAgents.get(0).getName()).append(" tomorrow at 2 PM'.");

                return new ChatResponse(response.toString());
            }

            Agent selected = findAgent(details.agentName, details.specialization);
            if (selected == null) {
                return new ChatResponse("Sorry, no matching agent found. Try specifying name or specialization like 'life insurance'.");
            }

            if (!"yes".equalsIgnoreCase(selected.getAvailability())) {
                return new ChatResponse("Sorry, " + selected.getName() + " is not available right now.");
            }

            String date = parseDate(details.date);
            String time = parseTime(details.time);

            if (date == null) return new ChatResponse("Please specify a date for the appointment.");
            if (time == null) time = "10:00 AM";

            Appointment a = new Appointment();
            a.setCustomerId(userId);
            a.setAgentId(selected.getId());
            a.setAppointmentDate(date);
            a.setAppointmentTime(time);
            a.setReason(details.reason != null ? details.reason : "Insurance consultation");
            a.setStatus("Scheduled");
            a.setCreatedAt(LocalDateTime.now());
            a.setUpdatedAt(LocalDateTime.now());

            Appointment saved = appointmentService.createAppointment(a);

            return new ChatResponse("✅ Appointment booked successfully!\n\n"
                    + "👩‍💼 Agent: " + selected.getName() + " (" + selected.getSpecialization() + ")\n"
                    + "📅 Date: " + date + "\n"
                    + "⏰ Time: " + time + "\n"
                    + "📝 Purpose: " + a.getReason() + "\n"
                    + "Appointment ID: " + saved.getId() + "\n\n"
                    + "A confirmation email will be sent shortly.");
        } catch (Exception e) {
            return new ChatResponse("Error while booking appointment: " + e.getMessage());
        }
    }

    private AppointmentDetails extractAppointmentDetails(String message) {
        AppointmentDetails details = new AppointmentDetails();
        String lower = message.toLowerCase();

        if (lower.contains("dr. priya") || lower.contains("dr priya")) details.agentName = "Dr. Priya";
        else if (lower.contains("priya")) details.agentName = "Priya";

        if (lower.contains("life insurance")) details.specialization = "Life Insurance";
        else if (lower.contains("health insurance") || lower.contains("medical")) details.specialization = "Health Insurance";
        else if (lower.contains("auto insurance") || lower.contains("car insurance")) details.specialization = "Auto Insurance";
        else if (lower.contains("home insurance")) details.specialization = "Property Insurance";
        else if (lower.contains("business insurance")) details.specialization = "Business Insurance";

        if (lower.contains("tomorrow")) details.date = "tomorrow";
        else if (lower.contains("today")) details.date = "today";
        else if (lower.contains("next week")) details.date = "next week";
        else {
            Matcher m = Pattern.compile("on\\s+([a-zA-Z0-9\\s,]+?)(?:\\s+at|$)", Pattern.CASE_INSENSITIVE).matcher(message);
            if (m.find()) details.date = m.group(1).trim();
        }

        Matcher t = Pattern.compile("at\\s+([0-9]{1,2}(?::[0-9]{2})?\\s*(?:am|pm)?)", Pattern.CASE_INSENSITIVE).matcher(message);
        if (t.find()) details.time = t.group(1).trim();

        return details;
    }

    private Agent findAgent(String agentName, String specialization) {
        List<Agent> agents = agentRepository.findAll().stream()
                .filter(a -> "yes".equalsIgnoreCase(a.getAvailability()))
                .toList();

        if (agentName != null && !agentName.isEmpty()) {
            Agent match = agents.stream()
                    .filter(a -> a.getName().toLowerCase().contains(agentName.toLowerCase()))
                    .findFirst().orElse(null);
            if (match != null) return match;
        }

        if (specialization != null) {
            Agent match = agents.stream()
                    .filter(a -> a.getSpecialization().toLowerCase().contains(specialization.toLowerCase()))
                    .findFirst().orElse(null);
            if (match != null) return match;
        }

        return null;
    }

    private String parseDate(String dateStr) {
        if (dateStr == null) return null;
        String lower = dateStr.toLowerCase().trim();
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter f = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return switch (lower) {
            case "today" -> now.format(f);
            case "tomorrow" -> now.plusDays(1).format(f);
            case "next week" -> now.plusWeeks(1).format(f);
            default -> now.plusDays(1).format(f);
        };
    }

    private String parseTime(String timeStr) {
        if (timeStr == null) return null;
        String lower = timeStr.toLowerCase().trim();
        if (lower.matches("\\d{1,2}\\s*pm") || lower.matches("\\d{1,2}\\s*am") || lower.matches("\\d{1,2}:\\d{2}\\s*[ap]m"))
            return lower.replace(" ", "").toUpperCase();
        if (lower.matches("\\d{1,2}")) return timeStr + ":00 PM";
        return timeStr;
    }

    private static class AppointmentDetails {
        String agentName;
        String specialization;
        String date;
        String time;
        String reason;
    }

    private String getRelevantDatabaseInfo(String userMessage) {
        StringBuilder info = new StringBuilder();
        String lower = userMessage.toLowerCase();

        if (lower.contains("agent") || lower.contains("advisor")) {
            long total = agentRepository.count();
            long available = agentRepository.findAll().stream()
                    .filter(a -> a.getAvailability() != null && a.getAvailability().equalsIgnoreCase("yes"))
                    .count();

            info.append("AGENTS INFO:\nTotal: ").append(total)
                .append("\nAvailable: ").append(available).append("\n");

            agentRepository.findAll().forEach(agent ->
                    info.append("• ").append(agent.getName()).append(" (")
                            .append(agent.getSpecialization()).append(") - ")
                            .append(agent.getAvailability()).append("\n"));
        }

        if (lower.contains("plan") || lower.contains("policy")) {
            long totalPlans = planRepository.count();
            info.append("\nPLANS INFO:\nTotal: ").append(totalPlans).append("\n");
            planRepository.findAll().forEach(p ->
                    info.append("• ").append(p.getPlanName()).append(" - $")
                            .append(p.getPrice()).append("/month\n"));
        }

        if (lower.contains("appointment")) {
            long totalAppointments = appointmentRepository.count();
            info.append("\nAPPOINTMENTS:\nTotal: ").append(totalAppointments).append("\n");
        }

        if (info.length() == 0)
            info.append("General insurance information is available. Ask about agents, plans, or appointments.\n");

        return info.toString();
    }

    private ChatResponse parseGeminiResponse(String body) {
        try {
            int start = body.indexOf("\"text\":");
            if (start != -1) {
                start = body.indexOf("\"", start + 7) + 1;
                int end = body.indexOf("\"", start);
                if (end != -1) {
                    String content = body.substring(start, end);
                    content = unescapeJson(content);
                    return new ChatResponse(content);
                }
            }
            return new ChatResponse("Could you please rephrase your question?");
        } catch (Exception e) {
            return new ChatResponse("Error processing AI response.");
        }
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
    }

    private static String unescapeJson(String s) {
        if (s == null) return null;
        return s.replaceAll("\\\\n", "\n").replaceAll("\\\\\"", "\"");
    }
}
