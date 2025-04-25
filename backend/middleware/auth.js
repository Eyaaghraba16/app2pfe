const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

// Configuration de la connexion MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'aya_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

module.exports = async (req, res, next) => {
    try {
        // Récupérer le token du header Authorization
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token non fourni' });
        }

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');

        // Récupérer les informations de l'utilisateur depuis la base de données
        const [rows] = await promisePool.execute(
            'SELECT id, email, role FROM users WHERE id = ?',
            [decoded.userId]
        );

        if (!rows[0]) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        // Ajouter les informations de l'utilisateur à l'objet request
        req.user = {
            id: rows[0].id,
            email: rows[0].email,
            role: rows[0].role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token invalide' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré' });
        }
        console.error('Erreur d\'authentification:', error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'authentification' });
    }
};
