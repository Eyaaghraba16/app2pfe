-- Vérifier les utilisateurs
SELECT id, email, firstname, lastname, role FROM users;

-- Vérifier les informations personnelles
SELECT pi.*, u.email 
FROM personal_info pi 
JOIN users u ON pi.user_id = u.id;

-- Vérifier les informations professionnelles
SELECT pri.*, u.email 
FROM professional_info pri 
JOIN users u ON pri.user_id = u.id;

-- Vérifier les demandes
SELECT r.*, u.email 
FROM requests r 
JOIN users u ON r.user_id = u.id;
