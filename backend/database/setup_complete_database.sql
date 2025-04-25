-- Suppression des tables existantes dans l'ordre pour respecter les contraintes de clés étrangères
DROP TABLE IF EXISTS request_comments;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS professional_info;
DROP TABLE IF EXISTS personal_info;
DROP TABLE IF EXISTS users;

-- Création de la table users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    role ENUM('user', 'chef', 'admin') DEFAULT 'user',
    chef_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chef_id) REFERENCES users(id)
);

-- Création de la table personal_info
CREATE TABLE personal_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    cin VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    nationality VARCHAR(50) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Création de la table professional_info
CREATE TABLE professional_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    hire_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Création de la table password_reset_tokens
CREATE TABLE password_reset_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Création de la table requests
CREATE TABLE requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status ENUM('en attente', 'chef_approved', 'chef_rejected', 'admin_approved', 'admin_rejected') DEFAULT 'en attente',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Création de la table request_comments
CREATE TABLE request_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertion du compte administrateur
INSERT INTO users (email, password, firstname, lastname, role) 
VALUES (
    'admin@aya.com',
    '$2a$10$XFE/UQjM8HLrWYz0Z4q1IeN1r3MQRhlBFNBp8YJ/qYuEBOBvERB46',
    'Admin',
    'System',
    'admin'
);

-- Insertion d'un compte utilisateur test avec ses informations personnelles et professionnelles
INSERT INTO users (email, password, firstname, lastname, role) 
VALUES (
    'test@example.com',
    '$2a$10$XFE/UQjM8HLrWYz0Z4q1IeN1r3MQRhlBFNBp8YJ/qYuEBOBvERB46',
    'Test',
    'User',
    'user'
);

-- Ajout des informations personnelles pour l'utilisateur test
INSERT INTO personal_info (user_id, cin, date_of_birth, nationality, address, phone)
VALUES (
    2, -- ID de l'utilisateur test
    'AB123456',
    '1990-01-01',
    'Marocaine',
    '123 Rue Example, Ville',
    '+212600000000'
);

-- Ajout des informations professionnelles pour l'utilisateur test
INSERT INTO professional_info (user_id, employee_id, department, position, hire_date)
VALUES (
    2, -- ID de l'utilisateur test
    'EMP001',
    'IT',
    'Développeur',
    '2024-01-01'
);

-- Création d'une demande de congé test
INSERT INTO requests (user_id, type, status, start_date, end_date, description)
VALUES (
    2, -- ID de l'utilisateur test
    'Congé annuel',
    'en attente',
    '2025-03-12',
    '2025-03-16',
    'Congé pour raisons personnelles'
);
