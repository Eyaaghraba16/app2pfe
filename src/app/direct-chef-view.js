// Script pour remplacer complètement la page et n'afficher que les demandes de congés et de formation
// Copiez ce code et exécutez-le dans la console du navigateur

// Fonction pour créer une interface simplifiée pour le chef
function createChefInterface() {
  // Récupérer toutes les demandes
  const allRequests = JSON.parse(localStorage.getItem('requests') || '[]');
  
  // Filtrer pour ne garder que les congés et formations
  const filteredRequests = allRequests.filter(request => {
    const type = request.type.toLowerCase();
    return type.includes('congé') || type.includes('formation');
  });
  
  console.log('Demandes filtrées pour le chef:', filteredRequests.length);
  
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
    createChefInterface(); // Rafraîchir l'interface
  }
  
  // Créer une nouvelle interface
  const container = document.createElement('div');
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.maxWidth = '1200px';
  container.style.margin = '0 auto';
  container.style.padding = '20px';
  
  // Ajouter l'en-tête
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '20px';
  
  // Logo et titre
  const logoDiv = document.createElement('div');
  logoDiv.style.display = 'flex';
  logoDiv.style.alignItems = 'center';
  
  const logo = document.createElement('img');
  logo.src = 'assets/logo.png';
  logo.alt = 'Logo';
  logo.style.width = '40px';
  logo.style.height = '40px';
  logo.style.marginRight = '10px';
  
  const title = document.createElement('h1');
  title.textContent = 'Chef Equipe';
  title.style.margin = '0';
  title.style.fontSize = '20px';
  
  logoDiv.appendChild(logo);
  logoDiv.appendChild(title);
  
  // Navigation
  const nav = document.createElement('div');
  nav.innerHTML = `
    <button style="background-color: #f0f0f0; border: none; padding: 8px 15px; margin-left: 10px; border-radius: 4px; cursor: pointer;">Tableau de bord</button>
    <button style="background-color: #007bff; color: white; border: none; padding: 8px 15px; margin-left: 10px; border-radius: 4px; cursor: pointer;">Demandes</button>
    <button style="background-color: #f0f0f0; border: none; padding: 8px 15px; margin-left: 10px; border-radius: 4px; cursor: pointer;">Profil</button>
    <button style="background-color: #f0f0f0; border: none; padding: 8px 15px; margin-left: 10px; border-radius: 4px; cursor: pointer;">Déconnexion</button>
  `;
  
  header.appendChild(logoDiv);
  header.appendChild(nav);
  
  // Ajouter le titre de la section
  const sectionTitle = document.createElement('h2');
  sectionTitle.textContent = 'Mes Demandes';
  sectionTitle.style.marginBottom = '20px';
  
  // Message d'information
  const infoMessage = document.createElement('div');
  infoMessage.style.backgroundColor = '#e6f7ff';
  infoMessage.style.padding = '10px';
  infoMessage.style.borderRadius = '5px';
  infoMessage.style.marginBottom = '20px';
  infoMessage.style.border = '1px solid #91d5ff';
  infoMessage.innerHTML = '<strong>Mode Chef:</strong> Seules les demandes de congés et de formation sont affichées.';
  
  // Créer le tableau des demandes
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginTop = '20px';
  
  // En-tête du tableau
  const thead = document.createElement('thead');
  thead.style.backgroundColor = '#f2f2f2';
  thead.innerHTML = `
    <tr>
      <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">ID</th>
      <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">DATE</th>
      <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">TYPE</th>
      <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">DESCRIPTION</th>
      <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">STATUS</th>
      <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">OBSERVATION</th>
      <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">TRAITÉ PAR</th>
      <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">ACTIONS</th>
    </tr>
  `;
  table.appendChild(thead);
  
  // Corps du tableau
  const tbody = document.createElement('tbody');
  
  if (filteredRequests.length === 0) {
    // Message si aucune demande
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="8" style="padding: 20px; text-align: center;">
        <div style="display: flex; flex-direction: column; align-items: center;">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="#ccc">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
            <path d="M12 7h-2v2H8v2h2v2h2v-2h2v-2h-2z"/>
          </svg>
          <p style="margin-top: 10px;">Aucune demande</p>
        </div>
      </td>
    `;
    tbody.appendChild(emptyRow);
  } else {
    // Ajouter chaque demande au tableau
    filteredRequests.forEach(request => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid #ddd';
      
      // Formater la date
      const date = new Date(request.date);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      
      // Déterminer la couleur du statut
      let statusColor = '#ffd700';
      let statusTextColor = 'black';
      
      if (request.status === 'Approuvée') {
        statusColor = '#4CAF50';
        statusTextColor = 'white';
      } else if (request.status === 'Rejetée') {
        statusColor = '#f44336';
        statusTextColor = 'white';
      } else if (request.status === 'Chef approuvé') {
        statusColor = '#8bc34a';
        statusTextColor = 'white';
      } else if (request.status === 'Chef rejeté') {
        statusColor = '#ff9800';
        statusTextColor = 'white';
      }
      
      tr.innerHTML = `
        <td style="padding: 12px;">${request.id}</td>
        <td style="padding: 12px;">${formattedDate}</td>
        <td style="padding: 12px;">${request.type}</td>
        <td style="padding: 12px;">${request.description}</td>
        <td style="padding: 12px;">
          <span style="
            padding: 5px 10px;
            border-radius: 4px;
            background-color: ${statusColor};
            color: ${statusTextColor};
          ">${request.status}</span>
        </td>
        <td style="padding: 12px;">${request.chefObservation || request.response || 'Pas de réponse'}</td>
        <td style="padding: 12px;">${request.processedBy || 'Non traité'}</td>
        <td style="padding: 12px;">
          ${request.status === 'En attente' ? `
            <button 
              onclick="approveRequest('${request.id}')"
              style="
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 5px;
              ">Approuver</button>
            <button 
              onclick="rejectRequest('${request.id}')"
              style="
                background-color: #f44336;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
              ">Rejeter</button>
          ` : `
            <button 
              onclick="showRequestDetails('${request.id}')"
              style="
                background-color: #f0f0f0;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
              ">Détails</button>
          `}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  table.appendChild(tbody);
  
  // Fonction pour afficher les détails d'une demande
  window.showRequestDetails = function(requestId) {
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
  };
  
  // Rendre les fonctions disponibles globalement
  window.approveRequest = approveRequest;
  window.rejectRequest = rejectRequest;
  
  // Assembler tous les éléments
  container.appendChild(header);
  container.appendChild(sectionTitle);
  container.appendChild(infoMessage);
  container.appendChild(table);
  
  // Remplacer le contenu de la page
  document.body.innerHTML = '';
  document.body.appendChild(container);
  
  console.log('Interface chef créée avec succès !');
}

// Vérifier si l'utilisateur est un chef
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
if (currentUser.role === 'chef') {
  createChefInterface();
  console.log('Interface chef activée.');
} else {
  console.log('L\'utilisateur n\'est pas un chef. Aucune modification appliquée.');
}
