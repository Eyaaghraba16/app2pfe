-- Mettre à jour le mot de passe du compte chef avec un mot de passe simple
UPDATE users 
SET password = '$2a$10$2mc700/qrOC/NKhEgoap8uPq8u5Xya.j7K0SbUIGeVo0iZ9c0FyBu' 
WHERE email = 'chef@aya.com';
