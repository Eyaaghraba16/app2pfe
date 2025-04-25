-- Suppression des tables avec des clés étrangères d'abord
DROP TABLE IF EXISTS request_comments;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS professional_info;
DROP TABLE IF EXISTS personal_info;
DROP TABLE IF EXISTS users;

-- Recréation de la table users avec la bonne structure
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

-- Recréation de la table requests avec les statuts intermédiaires
CREATE TABLE requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status ENUM('en attente', 'chef_approved', 'chef_rejected', 'admin_approved', 'admin_rejected') DEFAULT 'en attente',
    description TEXT,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Création du compte administrateur
INSERT INTO users (email, password, firstname, lastname, role) 
VALUES (
    'admin@aya.com',
    '$2a$10$XFE/UQjM8HLrWYz0Z4q1IeN1r3MQRhlBFNBp8YJ/qYuEBOBvERB46',
    'Admin',
    'System',
    'admin'
);

-- Création du compte chef
INSERT INTO users (email, password, firstname, lastname, role) 
VALUES (
    'chef@aya.com',
    '$2a$10$SO9jKdIMNcpJT1ucgfqTquKoBJxNhxU5MtcvzkCY2qG8m4ii1Xmau',
    'Chef',
    'Equipe',
    'chef'
);

-- Création d'un compte utilisateur test
INSERT INTO users (email, password, firstname, lastname, role) 
VALUES (
    'test@example.com',
    '$2a$10$XFE/UQjM8HLrWYz0Z4q1IeN1r3MQRhlBFNBp8YJ/qYuEBOBvERB46',
    'Test',
    'User',
    'user'
);
