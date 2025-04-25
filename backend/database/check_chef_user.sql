-- Vérifier les informations du compte chef
SELECT id, email, firstname, lastname, role, password 
FROM users 
WHERE email = 'chef@aya.com';
