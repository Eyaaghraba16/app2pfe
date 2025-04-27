import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import type { Request } from '../../models/request.model';
import { RequestsService } from '../../services/requests.service';

@Component({
  selector: 'app-request-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './request-calendar.component.html',
  styleUrls: ['./request-calendar.component.scss']
})
export class RequestCalendarComponent implements OnInit {
  selectedRequest: Request | null = null;
  showRequestDetails: boolean = false;
  
  // Données du calendrier
  weekdays: string[] = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  months: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  
  // Données des demandes
  requests: Request[] = []; // toujours synchronisé avec le service
  requestsByDay: Map<number, Request[]> = new Map();
  filteredRequests: Request[] = []; // variable locale pour affichage
  
  // Date actuelle pour le calendrier
  currentMonth: Date = new Date(); // Date actuelle par défaut
  daysInMonth: number[] = [];

  constructor(private requestsService: RequestsService) {}

  ngOnInit(): void {
    // Initialiser le calendrier pour le mois courant
    this.initializeCalendar();
    this.requestsService.requests$.subscribe((requests: Request[]) => {
      this.requests = requests;
      this.filterRequestsForCurrentMonth(); // met à jour filteredRequests
      this.groupRequestsByDay();
    });
  }
  
  initializeCalendar(): void {
    // Déterminer le nombre de jours dans le mois actuel
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Créer un tableau avec tous les jours du mois
    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }
  
  filterRequestsForCurrentMonth(): void {
    // L'admin doit voir toutes les demandes réelles, comme la page des demandes
    this.filteredRequests = [...this.requests];
    console.log(`Affichage de ${this.filteredRequests.length} demandes (toutes demandes réelles)`);
  }
  
  groupRequestsByDay(): void {
    // Réinitialiser la map
    this.requestsByDay = new Map();
    
    // Grouper les demandes par jour
    this.requests.forEach(request => {
      let day: number | null = null;
      
      // Utiliser la date de création si disponible
      if (request.createdAt) {
        day = new Date(request.createdAt).getDate();
      } 
      // Sinon utiliser la date de la demande
      else if (request.date) {
        day = new Date(request.date).getDate();
      }
      
      if (day !== null) {
        if (!this.requestsByDay.has(day)) {
          this.requestsByDay.set(day, []);
        }
        this.requestsByDay.get(day)?.push(request);
        console.log(`Added request ${request.id} (${request.type}) to day ${day}`);
      }
    });
    
    // Afficher les jours qui ont des demandes pour le débogage
    console.log('Jours avec des demandes:', Array.from(this.requestsByDay.keys()));
  }
  
  getRequestsForDay(day: number): Request[] {
    return this.requestsByDay.get(day) || [];
  }
  
  changeMonth(increment: number): void {
    const newMonth = new Date(this.currentMonth);
    newMonth.setMonth(this.currentMonth.getMonth() + increment);
    this.currentMonth = newMonth;

    this.initializeCalendar();
    this.filterRequestsForCurrentMonth();
    this.groupRequestsByDay();
  }
  
  getCurrentMonthName(): string {
    return this.months[this.currentMonth.getMonth()] + ' ' + this.currentMonth.getFullYear();
  }

  // Obtenir la classe CSS en fonction du statut de la demande
  getStatusClass(status: string): string {
    console.log('getStatusClass called with status:', status);
    
    // Normaliser le statut pour éviter les problèmes de casse ou d'accents
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus.includes('approuv') || normalizedStatus === 'admin_approved' || normalizedStatus === 'approved') {
      return 'status-approved';
    } else if (normalizedStatus.includes('rejet') || normalizedStatus === 'admin_rejected' || normalizedStatus === 'chef_rejected' || normalizedStatus === 'rejected') {
      return 'status-rejected';
    } else if (normalizedStatus.includes('chef') || normalizedStatus === 'chef_approved' || normalizedStatus === 'chef_approved') {
      return 'status-chef-approved';
    }
    return 'status-pending';
  }

  // Afficher les détails d'une demande
  viewRequestDetails(request: Request): void {
    this.selectedRequest = request;
    this.showRequestDetails = true;
  }

  closeRequestDetails(): void {
    this.showRequestDetails = false;
    this.selectedRequest = null;
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR');
  }


}
