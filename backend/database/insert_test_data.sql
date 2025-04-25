-- D'abord, vérifions les utilisateurs existants
SELECT id, email, firstname, lastname, role FROM users;

-- Ensuite, nous ajouterons des données de test pour un utilisateur existant
-- Remplacez [USER_ID] par l'ID réel de l'utilisateur test

-- Ajout des informations personnelles
INSERT INTO personal_info (user_id, cin, date_of_birth, nationality, address, phone)
SELECT 
    id,
    'AB123456',
    '1990-01-01',
    'Marocaine',
    '123 Rue Example, Ville',
    '+212600000000'
FROM users 
WHERE role = 'user' 
LIMIT 1;

-- Ajout des informations professionnelles
INSERT INTO professional_info (user_id, employee_id, department, position, hire_date)
SELECT 
    id,
    'EMP001',
    'IT',
    'Développeur',
    '2024-01-01'
FROM users 
WHERE role = 'user' 
LIMIT 1;

-- Création d'une demande de congé test
INSERT INTO requests (user_id, type, status, start_date, end_date, description)
SELECT 
    id,
    'Congé annuel',
    'en attente',
    '2025-03-12',
    '2025-03-16',
    'Congé pour raisons personnelles'
FROM users 
WHERE role = 'user' 
LIMIT 1;

-- Vérification des données insérées
SELECT 'Informations personnelles' as type, * FROM personal_info;
SELECT 'Informations professionnelles' as type, * FROM professional_info;
SELECT 'Demandes' as type, * FROM requests;
