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

// Créer une nouvelle demande
router.post('/', auth, async (req, res) => {
    try {
        const { type, details } = req.body;
        
        // Insérer la nouvelle demande
        const [result] = await promisePool.execute(
            'INSERT INTO requests (user_id, type, details, status, created_at, updated_at) VALUES (?, ?, ?, "En attente", NOW(), NOW())',
            [req.user.id, type, JSON.stringify(details)]
        );
        
        const requestId = result.insertId;
        
        // Récupérer les informations de l'utilisateur
        const [userInfo] = await promisePool.execute(
            'SELECT firstname, lastname FROM users WHERE id = ?',
            [req.user.id]
        );
        
        const userName = `${userInfo[0].firstname} ${userInfo[0].lastname}`;
        
        // Créer une notification pour l'admin
        const adminNotification = {
            id: Date.now().toString(),
            message: `Nouvelle demande de ${type} créée par ${userName}.`,
            type: 'info',
            timestamp: new Date(),
            read: false,
            link: `/admin/requests/details/${requestId}`
        };
        
        // Créer une notification pour le chef (uniquement pour les demandes de congés et de formation)
        if (type === 'congé' || type === 'formation') {
            const chefNotification = {
                id: (Date.now() + 1).toString(),
                message: `Nouvelle demande de ${type} créée par ${userName}.`,
                type: 'info',
                timestamp: new Date(),
                read: false,
                link: `/home/requests/details/${requestId}`
            };
            
            // Notifier le chef
            const notifyByRole = req.app.get('notifyByRole');
            notifyByRole('chef', chefNotification);
        }
        
        // Notifier l'admin
        const notifyByRole = req.app.get('notifyByRole');
        notifyByRole('admin', adminNotification);
        
        res.status(201).json({ 
            id: requestId,
            message: 'Demande créée avec succès' 
        });
    } catch (error) {
        console.error('Erreur lors de la création de la demande:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la demande' });
    }
});

// Mettre à jour le statut d'une demande (admin ou chef)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status, observation, niveau } = req.body; // niveau = 'chef' ou 'admin'
        const requestId = req.params.id;
        
        // Récupérer les informations de la demande et de l'utilisateur
        const [requestInfo] = await promisePool.execute(
            `SELECT r.*, u.id as user_id, u.firstname, u.lastname, u.email, u.role
             FROM requests r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.id = ?`,
            [requestId]
        );
        
        if (!requestInfo.length) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }
        
        const request = requestInfo[0];
        const userId = request.user_id;
        const userName = `${request.firstname} ${request.lastname}`;
        const requestType = request.type;
        
        // Si c'est le chef
        if (req.user.role === 'chef' && niveau === 'chef') {
            // Le chef ne peut approuver/rejeter que les demandes de congés et de formation
            if (requestType !== 'congé' && requestType !== 'formation') {
                return res.status(403).json({ 
                    message: 'Le chef ne peut traiter que les demandes de congés et de formation' 
                });
            }
            
            // On met à jour le statut à 'Chef approuvé' ou 'Chef rejeté'
            await promisePool.execute(
                `UPDATE requests 
                 SET status = ?, 
                     chef_observation = ?,
                     chef_processed_by = ?,
                     chef_processed_date = NOW(),
                     updated_at = NOW() 
                 WHERE id = ?`,
                [status, observation, req.user.id, requestId]
            );
            
            // Envoyer une notification à l'employé
            const employeeNotification = {
                id: Date.now().toString(),
                message: `Votre demande de ${requestType} a été ${status === 'Chef approuvé' ? 'approuvée' : 'rejetée'} par le chef.`,
                type: status === 'Chef approuvé' ? 'success' : 'warning',
                timestamp: new Date(),
                read: false,
                link: `/home/requests/details/${requestId}`
            };
            
            // Envoyer une notification à l'admin
            const adminNotification = {
                id: (Date.now() + 1).toString(),
                message: `Une demande de ${requestType} de ${userName} a été ${status === 'Chef approuvé' ? 'approuvée' : 'rejetée'} par le chef.`,
                type: 'info',
                timestamp: new Date(),
                read: false,
                link: `/admin/requests/details/${requestId}`
            };
            
            // Utiliser les fonctions de notification du serveur
            const sendNotification = req.app.get('sendNotification');
            const notifyByRole = req.app.get('notifyByRole');
            
            // Envoyer les notifications
            sendNotification(userId, employeeNotification);
            notifyByRole('admin', adminNotification);
            
            return res.json({ 
                message: 'Statut de la demande mis à jour par le chef',
                notifications: [employeeNotification, adminNotification]
            });
        }
        
        // Si c'est l'admin
        if (req.user.role === 'admin' && niveau === 'admin') {
            // On met à jour le statut à 'Approuvée' ou 'Rejetée'
            await promisePool.execute(
                `UPDATE requests 
                 SET status = ?, 
                     admin_response = ?,
                     admin_processed_by = ?,
                     admin_processed_date = NOW(),
                     updated_at = NOW() 
                 WHERE id = ?`,
                [status, observation, req.user.id, requestId]
            );
            
            // Envoyer une notification à l'employé
            const employeeNotification = {
                id: Date.now().toString(),
                message: `Votre demande de ${requestType} a été ${status === 'Approuvée' ? 'approuvée' : 'rejetée'} définitivement.`,
                type: status === 'Approuvée' ? 'success' : 'error',
                timestamp: new Date(),
                read: false,
                link: `/home/requests/details/${requestId}`
            };
            
            // Utiliser les fonctions de notification du serveur
            const sendNotification = req.app.get('sendNotification');
            
            // Envoyer la notification
            sendNotification(userId, employeeNotification);
            
            return res.json({ 
                message: 'Statut de la demande mis à jour par l\'admin',
                notifications: [employeeNotification]
            });
        }
        
        // Sinon accès refusé
        return res.status(403).json({ message: 'Accès non autorisé' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
    }
});

module.exports = router;
