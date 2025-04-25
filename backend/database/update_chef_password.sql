-- Mettre à jour le mot de passe du compte chef
UPDATE users 
SET password = '$2a$10$SO9jKdIMNcpJT1ucgfqTquKoBJxNhxU5MtcvzkCY2qG8m4ii1Xmau' 
WHERE email = 'chef@aya.com';
