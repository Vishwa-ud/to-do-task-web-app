-- Create database if not exists
CREATE DATABASE IF NOT EXISTS tododb;
USE tododb;

-- Create task table
CREATE TABLE IF NOT EXISTS task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_completed (completed),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for testing
INSERT INTO task (title, description, completed) VALUES
('Buy books', 'Buy books for the next school year', FALSE),
('Clean home', 'Need to clean the bed room', FALSE),
('Takehome assignment', 'Finish the mid-term assignment', FALSE),
('Play Cricket', 'Plan the soft ball cricket match on next Sunday', FALSE),
('Help Saman', 'Saman need help with his software project', FALSE);
