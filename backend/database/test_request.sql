-- Insérer une demande de test pour Eya Ghraba
INSERT INTO requests (user_id, type, status, start_date, end_date, description)
SELECT 
    id,
    'Congé maladie',
    'en attente',
    '2025-03-15',
    '2025-03-20',
    'Demande de congé maladie'
FROM users 
WHERE email = 'eya.ghraba@example.com';
