-- Create Database
CREATE DATABASE IF NOT EXISTS pandit_sewa;
USE pandit_sewa;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('customer', 'pandit') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pandits Table
CREATE TABLE pandits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    expertise VARCHAR(255) NOT NULL,
    experience INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    fee INT DEFAULT 5000,
    image_url VARCHAR(500),
    bio TEXT,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bookings Table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    pandit_id INT NOT NULL,
    puja_type VARCHAR(100) NOT NULL,
    puja_date DATE NOT NULL,
    puja_time TIME NOT NULL,
    location TEXT NOT NULL,
    status ENUM('pending', 'confirmed', 'assigned', 'on_the_way', 'completed', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) DEFAULT 5000.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pandit_id) REFERENCES pandits(id) ON DELETE CASCADE
);

-- Insert Sample Users (Pandits)
INSERT INTO users (name, email, password, phone, role) VALUES
('Pandit Ram Sharma', 'ram.sharma@panditsewa.com', 'hashed_password_1', '9801234567', 'pandit'),
('Pandit Hari Acharya', 'hari.acharya@panditsewa.com', 'hashed_password_2', '9801234568', 'pandit'),
('Pandit Krishna Joshi', 'krishna.joshi@panditsewa.com', 'hashed_password_3', '9801234569', 'pandit'),
('Pandit Shiva Bhattarai', 'shiva.bhattarai@panditsewa.com', 'hashed_password_4', '9801234570', 'pandit');

-- Insert Sample Pandits
INSERT INTO pandits (user_id, expertise, experience, rating, fee, image_url, bio) VALUES
(1, 'Rudri, Sarad Expert', 10, 4.8, 5000, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'Experienced in Vedic rituals'),
(2, 'Griha Puja Specialist', 7, 4.6, 4500, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Home blessing expert'),
(3, 'Sarad, Path Expert', 12, 4.9, 5500, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'Traditional puja specialist'),
(4, 'Bratabandha, Wedding', 15, 4.7, 6000, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'Ceremony specialist');

-- Insert Sample Customer
INSERT INTO users (name, email, password, phone, role) VALUES
('Test Customer', 'customer@test.com', 'test123', '9876543210', 'customer');