require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de la base de données MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',  // Remplace par ton utilisateur MySQL
    password: '',  // Remplace par ton mot de passe MySQL si nécessaire
    database: 'aya_db',  // Remplace par le nom de ta base de données
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convertir pool en promesses
const promisePool = pool.promise();

// Test de la connexion à la base de données
promisePool.query('SELECT 1')
    .then(() => {
        console.log('Connexion à MySQL réussie !');
    })
    .catch((err) => {
        console.error('Erreur de connexion à MySQL:', err);
    });

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token non fourni' });
    }

    jwt.verify(token, 'secret_token_jwt', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide' });
        }
        req.user = user;
        next();
    });
};

// Routes d'authentification
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Routes protégées
const requestsRoutes = require('./routes/requests');
app.use('/api/requests', authenticateToken, requestsRoutes);

// Route de test
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API Aya' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Une erreur est survenue !',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
