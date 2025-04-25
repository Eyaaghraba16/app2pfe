import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestsService } from '../services/requests.service';
import { Request } from '../models/request.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBarComponent]
})
export class AdminComponent implements OnInit {
  // Propriétés pour la gestion des demandes
  requests: Request[] = [];
  filteredRequests: Request[] = [];
  currentFilter: string = 'all';
  
  // Propriétés pour les modals
  selectedRequest: Request | null = null;
  showResponseModal: boolean = false;
  responseModalTitle: string = '';
  responseAction: 'approve' | 'reject' = 'approve';
  adminResponse: string = '';
  pendingRequestId: string = '';

  constructor(
    private requestsService: RequestsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRequests();
  }

  // Recherche de demandes
  onSearch(searchTerm: string) {
    if (!searchTerm) {
      this.applyCurrentFilter();
      return;
    }
    const term = searchTerm.toLowerCase();
    this.filteredRequests = this.getFilteredRequests().filter(request =>
      (request.user?.firstname?.toLowerCase().includes(term) ||
      request.user?.lastname?.toLowerCase().includes(term) ||
      request.userId?.includes(term) ||
      request.type?.toLowerCase().includes(term))
    );
  }

  // Filtrage des demandes
  filterRequests(filter: string) {
    this.currentFilter = filter;
    this.applyCurrentFilter();
  }

  applyCurrentFilter() {
    this.filteredRequests = this.getFilteredRequests();
  }

  getFilteredRequests(): Request[] {
    switch(this.currentFilter) {
      case 'chef':
        return this.requests.filter(request => 
          request.status === 'CHEF_APPROVED' || request.status === 'CHEF_REJECTED'
        );
      case 'pending':
        return this.requests.filter(request => request.status === 'PENDING');
      case 'all':
      default:
        return [...this.requests];
    }
  }

  // Chargement des demandes
  loadRequests() {
    this.requests = this.requestsService.getAllRequests();
    this.applyCurrentFilter();
  }

  // Affichage des détails d'une demande
  viewRequestDetails(request: Request) {
    this.selectedRequest = request;
  }

  closeModal() {
    this.selectedRequest = null;
  }

  // Approbation/rejet simple (pour les demandes en attente)
  approveRequest(id: string) {
    this.requestsService.updateRequestStatus(id, 'APPROVED');
    this.loadRequests();
  }

  rejectRequest(id: string) {
    this.requestsService.updateRequestStatus(id, 'REJECTED');
    this.loadRequests();
  }

  // Approbation/rejet final (pour les demandes traitées par le chef)
  finalApproveRequest(request: Request) {
    this.pendingRequestId = request.id;
    this.responseAction = 'approve';
    this.responseModalTitle = 'Approbation finale de la demande';
    this.adminResponse = '';
    this.showResponseModal = true;
  }

  finalRejectRequest(request: Request) {
    this.pendingRequestId = request.id;
    this.responseAction = 'reject';
    this.responseModalTitle = 'Rejet final de la demande';
    this.adminResponse = '';
    this.showResponseModal = true;
  }

  // Gestion de la réponse finale
  submitResponse() {
    const status = this.responseAction === 'approve' ? 'APPROVED' : 'REJECTED';
    this.requestsService.updateRequestStatus(this.pendingRequestId, status, this.adminResponse);
    this.showResponseModal = false;
    this.selectedRequest = null;
    this.loadRequests();
  }

  cancelResponse() {
    this.showResponseModal = false;
  }
}