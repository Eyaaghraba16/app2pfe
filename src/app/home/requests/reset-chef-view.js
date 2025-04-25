// Script pour réinitialiser les demandes et ne montrer que les congés et formations
// Copiez ce code et exécutez-le dans la console du navigateur

// Supprimer toutes les demandes existantes
localStorage.removeItem('requests');

// Créer uniquement des demandes de congés et de formation
const testRequests = [
  {
    id: 'conge-' + Date.now() + '-1',
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
    id: 'conge-' + Date.now() + '-2',
    userId: 'user-2',
    type: 'Congé parentalé',
    description: 'Congé parental',
    status: 'En attente',
    date: new Date().toISOString(),
    details: {
      startDate: '2025-06-01',
      endDate: '2025-07-01',
      leaveType: 'parental',
      dayPart: 'full',
      reason: 'Naissance'
    }
  },
  {
    id: 'formation-' + Date.now() + '-1',
    userId: 'user-3',
    type: 'formation',
    description: 'Formation Angular avancé',
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
  }
];

// Sauvegarder les demandes dans le localStorage
localStorage.setItem('requests', JSON.stringify(testRequests));

// Afficher un message de confirmation
console.log('Réinitialisation terminée !');
console.log('Demandes de congés et formation créées :', testRequests.length);
console.log('Rafraîchissez la page pour voir les changements.');

// Rafraîchir automatiquement la page après 2 secondes
setTimeout(() => {
  location.reload();
}, 2000);
