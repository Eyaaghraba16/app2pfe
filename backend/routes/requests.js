const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const auth = require('../middleware/auth');

// Configuration de la connexion MySQL
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

// Récupérer toutes les demandes (admin seulement)
router.get('/all', auth, async (req, res) => {
    try {
        // Vérifier si l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // Récupérer toutes les demandes avec les informations des utilisateurs
        const [requests] = await promisePool.execute(`
            SELECT r.*, 
                   u.firstname, 
                   u.lastname, 
                   u.email,
                   pi.cin,
                   pi.phone,
                   pri.department,
                   pri.position
            FROM requests r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN personal_info pi ON u.id = pi.user_id
            LEFT JOIN professional_info pri ON u.id = pri.user_id
            ORDER BY r.created_at DESC
        `);

        res.json(requests);
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des demandes' });
    }
});

// Récupérer les demandes des subordonnés du chef
router.get('/subordinates', auth, async (req, res) => {
    try {
        if (req.user.role !== 'chef') {
            return res.status(403).json({ message: 'Accès réservé au chef' });
        }
        // Récupérer les demandes des utilisateurs dont le chef_id = req.user.id
        const [requests] = await promisePool.execute(`
            SELECT r.*, u.firstname, u.lastname, u.email
            FROM requests r
            JOIN users u ON r.user_id = u.id
            WHERE u.chef_id = ?
            ORDER BY r.created_at DESC
        `, [req.user.id]);
        res.json(requests);
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes des subordonnés:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des demandes des subordonnés' });
    }
});

// Récupérer les demandes d'un utilisateur
router.get('/user/:userId', auth, async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Vérifier si l'utilisateur accède à ses propres demandes ou est admin
        if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        const [requests] = await promisePool.execute(
            'SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        res.json(requests);
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des demandes' });
    }
});

// Mettre à jour le statut d'une demande (admin ou chef)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status, niveau } = req.body; // niveau = 'chef' ou 'admin'
        const requestId = req.params.id;

        // Si c'est le chef
        if (req.user.role === 'chef' && niveau === 'chef') {
            // Le chef ne peut approuver/rejeter que les demandes de ses subordonnés
            // On vérifie que la demande appartient bien à un subordonné
            const [rows] = await promisePool.execute(
                `SELECT u.chef_id FROM requests r JOIN users u ON r.user_id = u.id WHERE r.id = ?`,
                [requestId]
            );
            if (!rows.length || rows[0].chef_id !== req.user.id) {
                return res.status(403).json({ message: 'Vous ne pouvez traiter que les demandes de vos subordonnés' });
            }
            // On met à jour le statut à 'chef_approved' ou 'chef_rejected'
            await promisePool.execute(
                'UPDATE requests SET status = ?, updated_at = NOW() WHERE id = ?',
                [status, requestId]
            );
            return res.json({ message: 'Statut de la demande mis à jour par le chef' });
        }
        // Si c'est l'admin
        if (req.user.role === 'admin' && niveau === 'admin') {
            await promisePool.execute(
                'UPDATE requests SET status = ?, updated_at = NOW() WHERE id = ?',
                [status, requestId]
            );
            return res.json({ message: 'Statut de la demande mis à jour par l\'admin' });
        }
        // Sinon accès refusé
        return res.status(403).json({ message: 'Accès non autorisé' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
    }
});

module.exports = router;
