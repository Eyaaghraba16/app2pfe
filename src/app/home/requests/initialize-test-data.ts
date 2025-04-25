import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestDataService {
  
  constructor() { }

  initializeTestData() {
    // Créer quelques demandes de test
    const testRequests = [
      {
        id: 'req-' + Date.now() + '-1',
        userId: 'test-1',
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
        id: 'req-' + Date.now() + '-2',
        userId: 'test-2',
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
        id: 'req-' + Date.now() + '-3',
        userId: 'test-3',
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

    console.log('Demandes de test créées avec succès !');
    console.log('Nombre total de demandes :', existingRequests.length);
    
    return existingRequests.length;
  }
}
