// Script pour ajouter des demandes de test
// Copiez ce code et exécutez-le dans la console du navigateur

// Créer des demandes de test
const testRequests = [
  {
    id: 'req-conge-' + Date.now(),
    userId: 'user-1',
    type: 'congé',
    description: 'Demande de congé annuel',
    status: 'En attente',
    date: new Date().toISOString(),
    details: {
      startDate: '2025-05-01',
      endDate: '2025-05-10',
      leaveType: 'annuel',
      dayPart: 'full',
      reason: 'Vacances d\'été'
    }
  },
  {
    id: 'req-formation-' + Date.now(),
    userId: 'user-1',
    type: 'formation',
    description: 'Demande de formation en développement web',
    status: 'En attente',
    date: new Date().toISOString(),
    details: {
      startDate: '2025-06-15',
      endDate: '2025-06-20',
      title: 'Formation Angular avancé',
      organization: 'Tech Academy',
      trainingType: 'technique',
      objectives: 'Améliorer les compétences en Angular',
      cost: 1500
    }
  },
  {
    id: 'req-document-' + Date.now(),
    userId: 'user-1',
    type: 'document',
    description: 'Demande d\'attestation de travail',
    status: 'En attente',
    date: new Date().toISOString(),
    details: {
      documentType: 'attestation',
      urgency: true,
      purpose: 'Démarches administratives'
    }
  }
];

// Récupérer les demandes existantes ou créer un tableau vide
let existingRequests = JSON.parse(localStorage.getItem('requests') || '[]');

// Ajouter les nouvelles demandes
existingRequests = [...existingRequests, ...testRequests];

// Sauvegarder dans le localStorage
localStorage.setItem('requests', JSON.stringify(existingRequests));

console.log('Demandes de test ajoutées avec succès !');
console.log('Nombre total de demandes :', existingRequests.length);
console.log('Rafraîchissez la page pour voir les demandes.');
