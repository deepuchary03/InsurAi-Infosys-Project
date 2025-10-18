package com.insurance.app.model;

public class ChatRequest {
    private String apiKey; // OpenAI API key provided by caller
    private String message; // message from user
    private String role; // optional: "user" or "agent" or "system"

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
}
