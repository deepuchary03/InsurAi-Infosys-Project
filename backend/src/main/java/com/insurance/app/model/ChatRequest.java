package com.insurance.app.model;

public class ChatRequest {
    private String apiKey; // OpenAI API key provided by caller
    private String message; // message from user
    private String role; // optional: "user" or "agent" or "system"
    private Long userId; // user ID for appointment booking

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
