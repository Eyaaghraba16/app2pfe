-- Table des demandes
CREATE TABLE IF NOT EXISTS requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    description TEXT,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des commentaires sur les demandes
CREATE TABLE IF NOT EXISTS request_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    admin_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id),
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Table des documents attachés aux demandes
CREATE TABLE IF NOT EXISTS request_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES requests(id)
);
