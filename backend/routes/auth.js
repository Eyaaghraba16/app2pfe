const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

// Configuration de la connexion MySQL depuis la mémoire
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Route d'inscription
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstname, lastname, role = 'user' } = req.body;

        // Vérifier si l'email existe déjà
        const [existingUsers] = await promisePool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        const [users] = await promisePool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer le nouvel utilisateur
        const [result] = await promisePool.execute(
            'INSERT INTO users (email, password, firstname, lastname, role) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, firstname, lastname, role]
        );

        // Créer le token JWT
        const token = jwt.sign(
            { userId: result.insertId, email, role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            token,
            user: {
                id: result.insertId,
                email,
                firstname,
                lastname,
                role
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Tentative de connexion:', { email });

        // Récupérer l'utilisateur
        const [users] = await promisePool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        console.log('Utilisateur trouvé:', users.length > 0 ? 'Oui' : 'Non');
        if (users.length > 0) {
            console.log('Rôle de l\'utilisateur:', users[0].role);
        }

        if (users.length === 0) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const user = users[0];

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('Mot de passe valide:', validPassword ? 'Oui' : 'Non');
        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Créer le token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
});

// Route de réinitialisation de mot de passe
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Vérifier si l'utilisateur existe
        const [users] = await promisePool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Générer un token de réinitialisation
        const resetToken = jwt.sign(
            { userId: users[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Sauvegarder le token dans la base de données
        await promisePool.execute(
            'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))',
            [users[0].id, resetToken]
        );

        // Dans un environnement de production, envoyez un email avec le lien de réinitialisation
        res.json({
            message: 'Instructions de réinitialisation envoyées par email',
            resetToken // À retirer en production
        });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error);
        res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
    }
});

module.exports = router;
