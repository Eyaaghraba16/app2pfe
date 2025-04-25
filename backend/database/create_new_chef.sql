-- Créer un nouveau compte chef avec un email différent
INSERT INTO users (email, password, firstname, lastname, role) 
VALUES (
    'chef2@aya.com',
    '$2a$10$2mc700/qrOC/NKhEgoap8uPq8u5Xya.j7K0SbUIGeVo0iZ9c0FyBu',
    'Chef',
    'Equipe',
    'chef'
);
