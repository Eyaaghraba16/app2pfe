import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Request {
  id: string;
  userId: string;
  type: string;
  description: string;
  status: string;
  date: string;
  chefObservation?: string;
  processedBy?: string;
  processedDate?: string;
  response?: string;
  details?: any;
}

@Component({
  selector: 'app-chef-view',
  templateUrl: './chef-view.component.html',
  styleUrls: ['./chef-view.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChefViewComponent implements OnInit {
  // Propriétés pour la gestion des demandes
  allRequests: Request[] = [];
  filteredRequests: Request[] = [];
  
  // Propriétés pour les modals
  selectedRequest: Request | null = null;
  showObservationModal: boolean = false;
  observationModalTitle: string = '';
  observationAction: 'approve' | 'reject' = 'approve';
  chefObservation: string = '';
  pendingRequestId: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadRequests();
  }

  // Chargement des demandes depuis le localStorage
  loadRequests(): void {
    const requestsJson = localStorage.getItem('requests') || '[]';
    this.allRequests = JSON.parse(requestsJson);
    
    // Filtrer pour ne garder que les congés et formations
    this.filteredRequests = this.allRequests.filter(request => {
      const type = request.type.toLowerCase();
      return type.includes('congé') || type.includes('formation');
    });
    
    console.log('Demandes filtrées pour le chef:', this.filteredRequests.length);
  }

  // Formatage de la date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  // Obtenir la classe CSS pour le statut
  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower === 'en attente') return 'status-pending';
    if (statusLower === 'approuvée' || statusLower === 'chef approuvé') return 'status-approved';
    if (statusLower === 'rejetée' || statusLower === 'chef rejeté') return 'status-rejected';
    return '';
  }

  // Afficher les détails d'une demande
  showRequestDetails(requestId: string): void {
    this.selectedRequest = this.allRequests.find(req => req.id === requestId) || null;
  }

  closeModal(): void {
    this.selectedRequest = null;
  }

  // Approuver une demande
  approveRequest(requestId: string): void {
    this.pendingRequestId = requestId;
    this.observationAction = 'approve';
    this.observationModalTitle = 'Approuver la demande';
    this.chefObservation = '';
    this.showObservationModal = true;
  }

  // Rejeter une demande
  rejectRequest(requestId: string): void {
    this.pendingRequestId = requestId;
    this.observationAction = 'reject';
    this.observationModalTitle = 'Rejeter la demande';
    this.chefObservation = '';
    this.showObservationModal = true;
  }

  // Annuler l'observation
  cancelObservation(): void {
    this.showObservationModal = false;
  }

  // Soumettre l'observation et mettre à jour le statut
  submitObservation(): void {
    if (!this.chefObservation.trim()) {
      alert('Veuillez entrer une observation pour l\'admin.');
      return;
    }

    const newStatus = this.observationAction === 'approve' ? 'Chef approuvé' : 'Chef rejeté';
    this.updateRequestStatus(this.pendingRequestId, newStatus, this.chefObservation);
    this.showObservationModal = false;
  }

  // Mettre à jour le statut d'une demande
  updateRequestStatus(requestId: string, newStatus: string, observation: string): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const updatedRequests = this.allRequests.map(request => {
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
    this.loadRequests();
  }
}
