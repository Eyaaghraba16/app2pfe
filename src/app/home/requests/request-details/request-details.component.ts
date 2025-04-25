import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequestsService, Request as RequestModel, RequestDetails, UpdateStatusResponse } from '../requests.service';
import { Request as ServiceRequest } from '../requests.service';
import { AuthService } from '../../../auth/auth.service';
import { NotificationService } from '../../../services/notification.service';

// Interface pour les détails de demande avec urgency comme chaîne
interface RequestModelDetails {
  // Champs communs à tous les types de demandes
  startDate?: string;
  endDate?: string;
  reason?: string;
  workingDays?: number;
  
  // Champs spécifiques aux demandes de congé
  leaveType?: string;
  dayPart?: 'full' | 'morning' | 'afternoon';
  
  // Champs spécifiques aux demandes de formation
  title?: string;
  organization?: string;
  trainingType?: string;
  objectives?: string;
  cost?: number;
  
  // Champs spécifiques aux demandes de document
  documentType?: string;
  urgency?: string;
  purpose?: string;
  language?: string;
  copies?: number;
  comments?: string;
  
  // Champs spécifiques aux demandes de prêt
  loanAmount?: number;
  loanType?: 'personal' | 'car' | 'house';
  loanReason?: string;
  duration?: number;
  monthlyPayment?: number;
  repaymentPeriod?: number;
  
  // Champs spécifiques aux demandes d'avance
  advanceAmount?: number;
  advanceReason?: string;
  repaymentDate?: string;
  
  // Autres champs
  department?: string;
  theme?: string;
  topic?: string;
  description?: string;
  additionalInfo?: string;
  attachments?: File[];
}

// Interface pour le modèle de demande avec les détails modifiés
interface RequestViewModel extends Omit<RequestModel, 'details'> {
  details: RequestModelDetails;
}

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [AuthService],
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent implements OnInit {
  request?: RequestViewModel;
  isAdmin = false;
  isChef = false;
  requestTypes = {
    LOAN: 'Prêt',
    DOCUMENT: 'Document',
    TRAINING: 'Formation',
    ADVANCE: 'Avance'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.isChef = this.authService.isChef();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestsService.getRequestById(id).subscribe(foundRequest => {
        if (foundRequest) {
          // Convert the service request to model request
          this.request = this.convertServiceRequestToModel(foundRequest);
        } else {
          this.router.navigate(['/home/requests']);
        }
      }, error => {
        console.error('Error fetching request:', error);
        this.router.navigate(['/home/requests']);
      });
    } else {
      this.router.navigate(['/home/requests']);
    }
  }

  private convertServiceRequestToModel(serviceRequest: ServiceRequest): RequestViewModel {
    // Créer une copie des détails pour éviter de modifier l'original
    const details = { ...serviceRequest.details } as RequestModelDetails;
    
    // Assurer que urgency est une chaîne
    if (typeof serviceRequest.details?.urgency === 'boolean') {
      details.urgency = serviceRequest.details.urgency ? 'high' : 'normal';
    }
    
    return {
      ...serviceRequest,
      details: details
    } as RequestViewModel;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'en attente':
        return 'status-pending';
      case 'chef approuvé':
        return 'status-chef-approved';
      case 'chef rejeté':
        return 'status-chef-rejected';
      case 'approuvée':
        return 'status-approved';
      case 'rejetée':
        return 'status-rejected';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status.toLowerCase()) {
      case 'en attente':
        return 'En attente';
      case 'chef approuvé':
        return 'Approuvé par le chef';
      case 'chef rejeté':
        return 'Rejeté par le chef';
      case 'approuvée':
        return 'Approuvée';
      case 'rejetée':
        return 'Rejetée';
      default:
        return status;
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('fr-FR');
    } catch {
      return '';
    }
  }

  onBack() {
    this.router.navigate(['/home/requests']);
  }

  onEdit() {
    if (this.request) {
      const type = this.request.type.toLowerCase();
      let route = '';
      
      // Mapper les types de demande aux routes correspondantes
      switch (type) {
        case 'congé annuel':
        case 'congé payé':
        case 'congé sans solde':
        case 'congé maladie':
        case 'congé maternité':
        case 'congé paternité':
          route = 'leave';
          break;
        case 'formation':
          route = 'training';
          break;
        case 'attestation de travail':
          route = 'certificate';
          break;
        case 'prêt':
          route = 'loan';
          break;
        case 'avance':
          route = 'advance';
          break;
        case 'document':
          route = 'document';
          break;
        default:
          console.error('Type de demande non reconnu:', type);
          return;
      }
      
      this.router.navigate([`/home/requests/${route}/edit/${this.request.id}`]);
    }
  }

  onDelete() {
    if (this.request && confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.requestsService.deleteRequest(this.request.id);
      this.router.navigate(['/home/requests']);
    }
  }

  approveRequest() {
    if (this.request) {
      this.requestsService.updateRequestStatus(this.request.id, 'Approuvée').subscribe((response: UpdateStatusResponse) => {
        if (response.success) {
          this.request!.status = 'Approuvée';
          
          // Afficher une notification locale
          this.notificationService.addNotification({
            id: Date.now().toString(),
            message: `Vous avez approuvé la demande de ${this.getRequestTypeLabel(this.request!.type)}.`,
            type: 'success',
            timestamp: new Date(),
            read: false
          });
        } else {
          alert('Erreur lors de l\'approbation de la demande.');
        }
      });
    }
  }

  rejectRequest() {
    if (this.request) {
      this.requestsService.updateRequestStatus(this.request.id, 'Rejetée').subscribe((response: UpdateStatusResponse) => {
        if (response.success) {
          this.request!.status = 'Rejetée';
          
          // Afficher une notification locale
          this.notificationService.addNotification({
            id: Date.now().toString(),
            message: `Vous avez rejeté la demande de ${this.getRequestTypeLabel(this.request!.type)}.`,
            type: 'error',
            timestamp: new Date(),
            read: false
          });
        } else {
          alert('Erreur lors du rejet de la demande.');
        }
      });
    }
  }
  
  // Nouvelles méthodes pour le chef avec observation
  approveRequestWithObservation(observation: string, isAdmin = false) {
    if (this.request) {
      // Vérifier si l'observation est vide
      if (!observation || observation.trim() === '') {
        if (isAdmin) {
          alert('Veuillez ajouter votre décision finale avant d\'approuver la demande.');
        } else {
          alert('Veuillez ajouter une observation avant d\'approuver la demande.');
        }
        return;
      }
      
      // Mettre à jour le statut avec l'observation
      const requestId = this.request.id;
      const newStatus = isAdmin ? 'Approuvée' : 'Chef approuvé';
      this.requestsService.updateRequestStatus(requestId, newStatus, observation).subscribe((response: UpdateStatusResponse) => {
        if (response.success && this.request) {
          // Gérer les notifications retournées par le backend
          if (response.notifications && response.notifications.length > 0) {
            // Les notifications sont déjà envoyées via WebSocket, mais on peut aussi les traiter ici si nécessaire
            console.log('Notifications envoyées:', response.notifications);
          }
          
          if (isAdmin) {
            // Mettre à jour l'affichage local
            this.request.status = 'Approuvée';
            this.request.adminResponse = observation;
            this.request.adminProcessedDate = new Date().toISOString();
            
            // Afficher une notification locale
            this.notificationService.addNotification({
              id: Date.now().toString(),
              message: `Vous avez approuvé définitivement la demande de ${this.getRequestTypeLabel(this.request.type)}.`,
              type: 'success',
              timestamp: new Date(),
              read: false
            });
          } else {
            // Mettre à jour l'affichage local
            this.request.status = 'Chef approuvé';
            this.request.chefObservation = observation;
            this.request.chefProcessedDate = new Date().toISOString();
            
            // Afficher une notification locale
            this.notificationService.addNotification({
              id: Date.now().toString(),
              message: `Vous avez approuvé la demande de ${this.getRequestTypeLabel(this.request.type)}. L'admin prendra la décision finale.`,
              type: 'success',
              timestamp: new Date(),
              read: false
            });
          }
        } else {
          alert('Erreur lors de l\'approbation de la demande.');
        }
      });
    }
  }
  
  rejectRequestWithObservation(observation: string, isAdmin = false): void {
    if (this.request) {
      // Vérifier si l'observation est vide
      if (!observation || observation.trim() === '') {
        if (isAdmin) {
          alert('Veuillez ajouter votre décision finale avant de rejeter la demande.');
        } else {
          alert('Veuillez ajouter une observation avant de rejeter la demande.');
        }
        return;
      }
      
      // Mettre à jour le statut avec l'observation
      const requestId = this.request.id;
      const newStatus = isAdmin ? 'Rejetée' : 'Chef rejeté';
      this.requestsService.updateRequestStatus(requestId, newStatus, observation).subscribe((response: UpdateStatusResponse) => {
        if (response.success && this.request) {
          // Gérer les notifications retournées par le backend
          if (response.notifications && response.notifications.length > 0) {
            // Les notifications sont déjà envoyées via WebSocket, mais on peut aussi les traiter ici si nécessaire
            console.log('Notifications envoyées:', response.notifications);
          }
          
          if (isAdmin) {
            // Mettre à jour l'affichage local
            this.request.status = 'Rejetée';
            this.request.adminResponse = observation;
            this.request.adminProcessedDate = new Date().toISOString();
            
            // Afficher une notification locale
            this.notificationService.addNotification({
              id: Date.now().toString(),
              message: `Vous avez rejeté définitivement la demande de ${this.getRequestTypeLabel(this.request.type)}.`,
              type: 'error',
              timestamp: new Date(),
              read: false
            });
          } else {
            // Mettre à jour l'affichage local
            this.request.status = 'Chef rejeté';
            this.request.chefObservation = observation;
            this.request.chefProcessedDate = new Date().toISOString();
            
            // Afficher une notification locale
            this.notificationService.addNotification({
              id: Date.now().toString(),
              message: `Vous avez rejeté la demande de ${this.getRequestTypeLabel(this.request.type)}. L'admin prendra la décision finale.`,
              type: 'warning',
              timestamp: new Date(),
              read: false
            });
          }
        } else {
          alert('Erreur lors du rejet de la demande.');
        }
      });
    }
  }

  getRequestTypeLabel(type: string): string {
    const typeKey = Object.keys(this.requestTypes).find(
      key => this.requestTypes[key as keyof typeof this.requestTypes].toLowerCase() === type.toLowerCase()
    );
    return typeKey ? this.requestTypes[typeKey as keyof typeof this.requestTypes] : type;
  }
}
