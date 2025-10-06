package com.insurance.app.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/login", "/api/users/register", "/h2-console/**").permitAll()
                
                .requestMatchers(HttpMethod.GET, "/api/agents/**").hasAnyRole("CUSTOMER", "AGENT", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/agents/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/agents/**").hasAnyRole("AGENT", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/agents/**").hasRole("ADMIN")
                
                .requestMatchers(HttpMethod.GET, "/api/plans/**").hasAnyRole("CUSTOMER", "AGENT", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/plans/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/plans/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/plans/**").hasRole("ADMIN")
                
                .requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                
                .requestMatchers("/api/appointments/**").hasAnyRole("CUSTOMER", "AGENT", "ADMIN")
                
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
