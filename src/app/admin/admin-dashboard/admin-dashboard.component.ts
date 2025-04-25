import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestsService } from '../../services/requests.service';
import { Request } from '../../models/request.model';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { NotificationsComponent } from '../../shared/notifications/notifications.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBarComponent, NotificationsComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
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
  approveRequest(request: Request) {
    if (request && request.id) {
      this.requestsService.updateRequestStatus(String(request.id), 'APPROVED');
      this.loadRequests();
    }
  }

  rejectRequest(request: Request) {
    if (request && request.id) {
      this.requestsService.updateRequestStatus(String(request.id), 'REJECTED');
      this.loadRequests();
    }
  }

  // Approbation/rejet final (pour les demandes traitées par le chef)
  finalApproveRequest(request: Request) {
    this.responseAction = 'approve';
    this.responseModalTitle = 'Approbation finale';
    this.pendingRequestId = String(request.id);
    this.showResponseModal = true;
  }

  finalRejectRequest(request: Request) {
    this.responseAction = 'reject';
    this.responseModalTitle = 'Rejet final';
    this.pendingRequestId = String(request.id);
    this.showResponseModal = true;
  }

  // Gestion des réponses finales
  submitResponse() {
    if (this.responseAction === 'approve') {
      this.requestsService.updateRequestStatus(this.pendingRequestId, 'APPROVED', this.adminResponse);
    } else {
      this.requestsService.updateRequestStatus(this.pendingRequestId, 'REJECTED', this.adminResponse);
    }
    this.cancelResponse();
    this.loadRequests();
  }

  cancelResponse() {
    this.showResponseModal = false;
    this.adminResponse = '';
    this.pendingRequestId = '';
  }
}
