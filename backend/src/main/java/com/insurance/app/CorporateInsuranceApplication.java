package com.insurance.app;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CorporateInsuranceApplication {

    public static void main(String[] args) {
        // Load variables from .env file before Spring starts
        Dotenv dotenv = Dotenv.configure()
                              .ignoreIfMissing() // Safe if .env not found
                              .load();

        // Set all .env entries as System properties (so Spring can read them)
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );

        // Optional safety check
        if (dotenv.get("GEMINI_API_KEY") == null) {
            System.err.println("⚠️ Warning: GEMINI_API_KEY is missing in your .env file!");
        }

        SpringApplication.run(CorporateInsuranceApplication.class, args);
    }
}
