import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequestsService } from '../requests.service';
import { Request as RequestModel } from '../request.model';
import { Request as ServiceRequest } from '../requests.service';
import { AuthService } from '../../../auth/auth.service';

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
  request?: RequestModel;
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
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.isChef = this.authService.isChef();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const foundRequest = this.requestsService.getRequestById(id);
      if (foundRequest) {
        // Convert the service request to model request
        this.request = this.convertServiceRequestToModel(foundRequest);
      } else {
        this.router.navigate(['/home/requests']);
      }
    } else {
      this.router.navigate(['/home/requests']);
    }
  }

  private convertServiceRequestToModel(serviceRequest: ServiceRequest): RequestModel {
    return {
      ...serviceRequest,
      details: {
        ...serviceRequest.details,
        // Convert boolean urgency to string if it exists
        urgency: typeof serviceRequest.details?.urgency === 'boolean' 
          ? serviceRequest.details.urgency ? 'high' : 'normal'
          : serviceRequest.details?.urgency
      }
    };
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
      this.requestsService.updateRequestStatus(this.request.id, 'Approuvée');
      this.request.status = 'Approuvée';
    }
  }

  rejectRequest() {
    if (this.request) {
      this.requestsService.updateRequestStatus(this.request.id, 'Rejetée');
      this.request.status = 'Rejetée';
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
      this.requestsService.updateRequestStatus(requestId, newStatus, observation).subscribe(success => {
        if (success && this.request) {
          if (isAdmin) {
            alert('Demande approuvée définitivement avec succès.');
            // Mettre à jour l'affichage local
            this.request.status = 'Approuvée';
            this.request.adminResponse = observation;
            this.request.adminProcessedDate = new Date().toISOString();
          } else {
            alert('Demande approuvée avec succès. L\'admin prendra la décision finale.');
            // Mettre à jour l'affichage local
            this.request.status = 'Chef approuvé';
            this.request.chefObservation = observation;
            this.request.chefProcessedDate = new Date().toISOString();
          }
        } else {
          alert('Erreur lors de l\'approbation de la demande.');
        }
      });
    }
  }
  
  rejectRequestWithObservation(observation: string, isAdmin = false) {
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
      this.requestsService.updateRequestStatus(requestId, newStatus, observation).subscribe(success => {
        if (success && this.request) {
          if (isAdmin) {
            alert('Demande rejetée définitivement avec succès.');
            // Mettre à jour l'affichage local
            this.request.status = 'Rejetée';
            this.request.adminResponse = observation;
            this.request.adminProcessedDate = new Date().toISOString();
          } else {
            alert('Demande rejetée avec succès. L\'admin prendra la décision finale.');
            // Mettre à jour l'affichage local
            this.request.status = 'Chef rejeté';
            this.request.chefObservation = observation;
            this.request.chefProcessedDate = new Date().toISOString();
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
