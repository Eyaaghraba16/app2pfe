import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestsService } from '../services/requests.service';
import { Request } from '../models/request.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';
import { NotificationsComponent } from '../shared/notifications/notifications.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SearchBarComponent, NotificationsComponent]
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
  
  // Propriétés pour la vue (liste ou calendrier)
  activeView: 'list' | 'calendar' = 'list';
  
  // Propriétés pour le calendrier
  currentMonth: Date = new Date();
  calendarDays: { number: number, requests: Request[] }[] = [];
  weekdays: string[] = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  months: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  


  constructor(
    private requestsService: RequestsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRequests();
    this.generateCalendar();
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
    this.generateCalendar();
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
    this.adminResponse = '';
    this.pendingRequestId = '';
  }
  
  // Méthodes pour le calendrier
  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Premier jour du mois (0 = dimanche, 1 = lundi, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    
    // Nombre de jours dans le mois
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Initialiser le tableau des jours
    this.calendarDays = [];
    
    // Ajouter les cases vides pour les jours avant le premier jour du mois
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push({ number: 0, requests: [] });
    }
    
    // Ajouter les jours du mois avec leurs demandes
    for (let i = 1; i <= daysInMonth; i++) {
      const dayRequests = this.getRequestsForDay(i);
      this.calendarDays.push({ number: i, requests: dayRequests });
    }
    
    // Compléter la dernière semaine avec des cases vides si nécessaire
    const remainingCells = 42 - this.calendarDays.length; // 6 semaines * 7 jours = 42
    for (let i = 0; i < remainingCells; i++) {
      this.calendarDays.push({ number: 0, requests: [] });
    }
  }
  
  getRequestsForDay(day: number): Request[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const dayStart = new Date(year, month, day);
    const dayEnd = new Date(year, month, day, 23, 59, 59, 999);
    
    return this.requests.filter(request => {
      if (!request.createdAt) return false;
      
      const requestDate = new Date(request.createdAt);
      return requestDate >= dayStart && requestDate <= dayEnd;
    });
  }
  
  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }
  
  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }
  
  getStatusClass(status: string): string {
    if (status === 'APPROVED' || status === 'admin_approved') {
      return 'status-approved';
    } else if (status === 'REJECTED' || status === 'admin_rejected' || status === 'chef_rejected') {
      return 'status-rejected';
    } else if (status === 'CHEF_APPROVED' || status === 'chef_approved') {
      return 'status-chef-approved';
    }
    return 'status-pending';
  }
}