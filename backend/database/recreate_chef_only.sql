-- Supprimer uniquement le compte chef existant
DELETE FROM users WHERE email = 'chef@aya.com';

-- Recréer le compte chef avec un nouveau mot de passe
INSERT INTO users (email, password, firstname, lastname, role) 
VALUES (
    'chef@aya.com',
    '$2a$10$SO9jKdIMNcpJT1ucgfqTquKoBJxNhxU5MtcvzkCY2qG8m4ii1Xmau',
    'Chef',
    'Equipe',
    'chef'
);
