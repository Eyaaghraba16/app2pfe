// Script pour ajouter la fonctionnalité d'approbation avec observation
// Copiez ce code et exécutez-le dans la console du navigateur

// Fonction pour approuver une demande avec observation
function approveRequest(requestId) {
  const observation = prompt('Veuillez entrer une observation pour l\'admin:');
  if (observation !== null) {
    updateRequestStatus(requestId, 'Chef approuvé', observation);
  }
}

// Fonction pour rejeter une demande avec observation
function rejectRequest(requestId) {
  const observation = prompt('Veuillez entrer une observation pour l\'admin concernant ce rejet:');
  if (observation !== null) {
    updateRequestStatus(requestId, 'Chef rejeté', observation);
  }
}

// Fonction pour mettre à jour le statut d'une demande
function updateRequestStatus(requestId, newStatus, observation) {
  const allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  const updatedRequests = allRequests.map(request => {
    if (request.id === requestId) {
      return {
        ...request,
        status: newStatus,
        processedBy: currentUser.username || 'Chef',
        chefObservation: observation,
        processedDate: new Date().toISOString()
      };
    }
    return request;
  });
  
  localStorage.setItem('requests', JSON.stringify(updatedRequests));
  alert('Demande mise à jour avec succès!');
  location.reload(); // Rafraîchir la page pour voir les changements
}

// Fonction pour afficher les détails d'une demande
function showRequestDetails(requestId) {
  const allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
  const request = allRequests.find(req => req.id === requestId);
  
  if (request) {
    const date = new Date(request.date);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
    let processedDate = 'Non traité';
    if (request.processedDate) {
      const pDate = new Date(request.processedDate);
      processedDate = `${pDate.getDate().toString().padStart(2, '0')}/${(pDate.getMonth() + 1).toString().padStart(2, '0')}/${pDate.getFullYear()} ${pDate.getHours().toString().padStart(2, '0')}:${pDate.getMinutes().toString().padStart(2, '0')}`;
    }
    
    alert(`
      Détails de la demande #${request.id}\n
      Type: ${request.type}\n
      Date: ${formattedDate}\n
      Description: ${request.description}\n
      Statut: ${request.status}\n
      Observation du chef: ${request.chefObservation || 'Aucune observation'}\n
      Réponse finale: ${request.response || 'Pas encore de réponse finale'}\n
      Traité par: ${request.processedBy || 'Non traité'}\n
      Date de traitement: ${processedDate}\n
    `);
  }
}

// Ajouter les fonctions aux boutons existants
document.querySelectorAll('button').forEach(button => {
  const buttonText = button.textContent.trim();
  
  if (buttonText === 'Approuver') {
    // Récupérer l'ID de la demande depuis la ligne du tableau
    const row = button.closest('tr');
    const requestId = row.cells[0].textContent.trim();
    
    // Remplacer l'événement du bouton
    button.onclick = function() {
      approveRequest(requestId);
    };
  }
  else if (buttonText === 'Rejeter') {
    // Récupérer l'ID de la demande depuis la ligne du tableau
    const row = button.closest('tr');
    const requestId = row.cells[0].textContent.trim();
    
    // Remplacer l'événement du bouton
    button.onclick = function() {
      rejectRequest(requestId);
    };
  }
  else if (buttonText === 'Détails') {
    // Récupérer l'ID de la demande depuis la ligne du tableau
    const row = button.closest('tr');
    const requestId = row.cells[0].textContent.trim();
    
    // Remplacer l'événement du bouton
    button.onclick = function() {
      showRequestDetails(requestId);
    };
  }
});

// Mettre à jour l'en-tête du tableau pour afficher "OBSERVATION" au lieu de "RÉPONSE"
const headers = document.querySelectorAll('th');
headers.forEach(header => {
  if (header.textContent.trim() === 'RÉPONSE') {
    header.textContent = 'OBSERVATION';
  }
});

console.log('Script d\'approbation avec observation chargé avec succès!');
alert('Les boutons d\'approbation et de rejet ont été mis à jour pour permettre l\'ajout d\'observations pour l\'admin.');
