-- MySQL Database Setup Script for Insurance Application

-- Create database
CREATE DATABASE IF NOT EXISTS insurancedb;

-- Use the database
USE insurancedb;

-- Grant privileges (if needed for your MySQL user)
-- GRANT ALL PRIVILEGES ON insurancedb.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

-- Create Users table with enhanced fields
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    email VARCHAR(255) UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    full_name VARCHAR(255),
    phone VARCHAR(20)
);

-- Create Agents table with enhanced fields
CREATE TABLE IF NOT EXISTS agents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    availability VARCHAR(50),
    schedule VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(20),
    working_hours VARCHAR(100),
    qualifications TEXT,
    experience_years INT
);

-- Create Plans table (prices in Indian Rupees)
CREATE TABLE IF NOT EXISTS plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plan_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2)
);

-- Create Appointments table with enhanced fields
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT,
    agent_id BIGINT,
    appointment_date VARCHAR(255),
    appointment_time VARCHAR(255),
    status VARCHAR(50),
    reason VARCHAR(500),
    notes TEXT,
    customer_name VARCHAR(255),
    agent_name VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

-- Create Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_id BIGINT,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    notification_type VARCHAR(50),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    appointment_id BIGINT,
    created_at DATETIME,
    sent_at DATETIME,
    error_message TEXT,
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
);

-- Insert sample data

-- Insert sample users
INSERT IGNORE INTO users (username, password, role, email, full_name, email_verified) VALUES 
('admin', '$2a$10$X5wFBtLrC0zGNzUt8j3j.OZD4nvqhFc.6wCgj8p1ZYQjWN3LmGZpS', 'ADMIN', 'admin@insuranceco.in', 'Administrator', TRUE),
('pranav', '$2a$10$X5wFBtLrC0zGNzUt8j3j.OZD4nvqhFc.6wCgj8p1ZYQjWN3LmGZpS', 'CUSTOMER', 'pranav@email.com', 'Pranav Kumar', TRUE),
('ranav', '$2a$10$X5wFBtLrC0zGNzUt8j3j.OZD4nvqhFc.6wCgj8p1ZYQjWN3LmGZpS', 'CUSTOMER', 'ranav@email.com', 'Ranav Kumar', TRUE),
('customer1', '$2a$10$X5wFBtLrC0zGNzUt8j3j.OZD4nvqhFc.6wCgj8p1ZYQjWN3LmGZpS', 'CUSTOMER', 'customer1@email.com', 'John Doe', TRUE),
('customer2', '$2a$10$X5wFBtLrC0zGNzUt8j3j.OZD4nvqhFc.6wCgj8p1ZYQjWN3LmGZpS', 'CUSTOMER', 'customer2@email.com', 'Jane Smith', TRUE),
('agent1', '$2a$10$X5wFBtLrC0zGNzUt8j3j.OZD4nvqhFc.6wCgj8p1ZYQjWN3LmGZpS', 'AGENT', 'priya.sharma@insuranceco.in', 'Dr. Priya Sharma', TRUE),
('agent2', '$2a$10$X5wFBtLrC0zGNzUt8j3j.OZD4nvqhFc.6wCgj8p1ZYQjWN3LmGZpS', 'AGENT', 'rajesh.kumar@insuranceco.in', 'Rajesh Kumar', TRUE);

-- Insert sample agents (5 comprehensive agents)
INSERT IGNORE INTO agents (name, specialization, availability, email, phone, working_hours, qualifications, experience_years) VALUES 
('Dr. Priya Sharma', 'Life Insurance & Investment Plans', 'yes', 'priya.sharma@insuranceco.in', '+91-98765-43210', '9:00 AM - 6:00 PM', 'IRDA Certified, MBA Finance, Life Insurance Specialist', 12),
('Rajesh Kumar', 'Motor & Vehicle Insurance', 'yes', 'rajesh.kumar@insuranceco.in', '+91-98765-43211', '8:00 AM - 5:00 PM', 'IRDA Licensed Agent, Motor Insurance Expert, Claims Specialist', 8),
('Ms. Anjali Patel', 'Health & Medical Insurance', 'yes', 'anjali.patel@insuranceco.in', '+91-98765-43212', '10:00 AM - 7:00 PM', 'Health Insurance Advisor, Medical Claims Expert, IRDA Certified', 15),
('Suresh Reddy', 'Property & Home Insurance', 'yes', 'suresh.reddy@insuranceco.in', '+91-98765-43213', '9:00 AM - 6:00 PM', 'Property Insurance Specialist, Risk Assessment Expert, IRDA Licensed', 10),
('Ms. Kavitha Nair', 'Business & Commercial Insurance', 'yes', 'kavitha.nair@insuranceco.in', '+91-98765-43214', '9:30 AM - 6:30 PM', 'Commercial Insurance Expert, Business Risk Advisor, IRDA Certified', 18);

-- Insert sample plans (3 comprehensive plans with Indian pricing)
INSERT IGNORE INTO plans (plan_name, description, price) VALUES 
('Jeevan Suraksha Plus', 'Comprehensive life insurance with investment benefits. Covers natural and accidental death with maturity benefits. Suitable for salaried individuals and business owners.', 25000),
('Swasthya Shield Family', 'Complete family health insurance covering hospitalization, pre and post hospitalization expenses, ambulance charges, and cashless treatment at 10,000+ network hospitals across India.', 45000),
('Ghar Suraksha Premium', 'All-inclusive home insurance covering structure, contents, personal liability, and natural calamities. Includes coverage for electronics, jewelry, and temporary accommodation expenses.', 18000);

-- The tables will be created automatically by Hibernate when the application starts
-- This script provides the manual creation option with sample data