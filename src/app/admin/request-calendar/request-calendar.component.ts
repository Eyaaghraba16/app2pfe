import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsService } from '../../services/requests.service';
import { Request } from '../../models/request.model';

@Component({
  selector: 'app-request-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request-calendar.component.html',
  styleUrls: ['./request-calendar.component.scss']
})
export class RequestCalendarComponent implements OnInit {
  requests: Request[] = [];
  selectedRequest: Request | null = null;
  showRequestDetails: boolean = false;
  
  // Grouper les demandes par mois et jour
  requestsByMonth: { [key: string]: Request[] } = {};
  currentMonth: Date = new Date();
  daysInMonth: number[] = [];
  weekdays: string[] = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  months: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  constructor(private requestsService: RequestsService) {}

  ngOnInit(): void {
    this.loadRequests();
    this.generateCalendarDays();
  }

  loadRequests(): void {
    // Le service retourne directement un tableau, pas un Observable
    this.requests = this.requestsService.getAllRequests();
    this.groupRequestsByDate();
  }

  // Générer les jours du mois actuel
  generateCalendarDays(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  // Grouper les demandes par date
  groupRequestsByDate(): void {
    this.requestsByMonth = {};
    
    this.requests.forEach(request => {
      if (request.createdAt) {
        const date = new Date(request.createdAt);
        const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        
        if (!this.requestsByMonth[dateKey]) {
          this.requestsByMonth[dateKey] = [];
        }
        
        this.requestsByMonth[dateKey].push(request);
      }
    });
  }

  // Obtenir les demandes pour un jour spécifique
  getRequestsForDay(day: number): Request[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth() + 1;
    const dateKey = `${year}-${month}-${day}`;
    
    return this.requestsByMonth[dateKey] || [];
  }

  // Obtenir la classe CSS en fonction du statut de la demande
  getStatusClass(status: string): string {
    if (status === 'Approuvée' || status === 'admin_approved' || status === 'APPROVED') {
      return 'status-approved';
    } else if (status === 'Rejetée' || status === 'admin_rejected' || status === 'chef_rejected' || status === 'REJECTED') {
      return 'status-rejected';
    } else if (status === 'chef_approved' || status === 'CHEF_APPROVED') {
      return 'status-chef-approved';
    }
    return 'status-pending';
  }

  // Naviguer vers le mois précédent
  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendarDays();
  }

  // Naviguer vers le mois suivant
  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendarDays();
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
