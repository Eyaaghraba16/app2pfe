import { Component, OnInit } from '@angular/core';
import { RequestService } from '../services/request.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Request } from '../models/request.model';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  requests: Request[] = [];
  selectedRequest: Request | null = null;
  isAdmin: boolean = false;
  isChef: boolean = false;
  loading: boolean = true;

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.isChef = this.authService.hasRole('chef');
  }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    if (this.isAdmin) {
      // Admin voit toutes les demandes
      this.requestService.getAllRequests().subscribe({
        next: (requests) => {
          this.requests = requests;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des demandes:', error);
          this.snackBar.open('Erreur lors du chargement des demandes', 'Fermer', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    } else if (this.isChef) {
      // Chef voit les demandes de ses subordonnés
      this.requestService.getSubordinatesRequests().subscribe({
        next: (requests) => {
          this.requests = requests;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des demandes des subordonnés:', error);
          this.snackBar.open('Erreur lors du chargement des demandes', 'Fermer', {
            duration: 3000
          });
          this.loading = false;
        }
      });
    } else {
      // Utilisateur normal voit ses propres demandes
      const userId = String(this.authService.getCurrentUserId());
      if (userId) {
        this.requestService.getUserRequests(userId).subscribe({
          next: (requests) => {
            this.requests = requests;
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des demandes:', error);
            this.snackBar.open('Erreur lors du chargement des demandes', 'Fermer', {
              duration: 3000
            });
            this.loading = false;
          }
        });
      }
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getUserFullName(request: Request): string {
    return `${request.user?.firstname} ${request.user?.lastname}`;
  }

  viewRequestDetails(request: Request): void {
    this.selectedRequest = request;
  }

  closeDetails(): void {
    this.selectedRequest = null;
  }

  approveRequest(request: Request): void {
    if (!this.isAdmin && !this.isChef) return;
    
    // Statut différent selon le rôle
    const newStatus = this.isAdmin ? 'admin_approved' : 'chef_approved';

    this.requestService.updateRequestStatus(String(request.id), newStatus).subscribe({
      next: () => {
        this.snackBar.open('Demande approuvée avec succès', 'Fermer', {
          duration: 3000
        });

        // Générer un ID unique pour les notifications
        const baseId = 'notification-' + new Date().getTime();
        
        if (this.isAdmin) {
          // 1. Notification pour l'admin qui a approuvé la demande
          this.notificationService.addNotification({
            id: baseId + '-admin',
            message: `Vous avez approuvé définitivement la demande de ${request.type}`,
            type: 'success',
            timestamp: new Date(),
            read: false,
            targetUserId: 'admin-approval', // Identifiant spécial pour l'admin qui approuve
            link: `/requests/details/${request.id}`
          });
          
          // 2. Notification pour les autres utilisateurs (chef et employés)
          this.notificationService.addNotification({
            id: baseId + '-others',
            message: `L'admin a approuvé définitivement la demande de ${request.type}`,
            type: 'info',
            timestamp: new Date(),
            read: false,
            targetUserId: 'others-admin-approval', // Identifiant pour les autres utilisateurs
            link: `/requests/details/${request.id}`
          });
        } else { // Si c'est un chef
          // 1. Notification pour le chef qui a approuvé la demande
          this.notificationService.addNotification({
            id: baseId + '-chef',
            message: `Vous avez approuvé la demande de ${request.type}. L'admin prendra la décision finale.`,
            type: 'success',
            timestamp: new Date(),
            read: false,
            targetUserId: 'chef-approval', // Identifiant spécial pour le chef qui approuve
            link: `/requests/details/${request.id}`
          });
          
          // 2. Notification pour les autres utilisateurs (admin et employés)
          this.notificationService.addNotification({
            id: baseId + '-others',
            message: `Le chef a approuvé la demande de ${request.type}. En attente de l'approbation de l'admin.`,
            type: 'info',
            timestamp: new Date(),
            read: false,
            targetUserId: 'others-chef-approval', // Identifiant pour les autres utilisateurs
            link: `/requests/details/${request.id}`
          });
        }

        this.loadRequests();
      },
      error: (error) => {
        console.error('Erreur lors de l\'approbation de la demande:', error);
        this.snackBar.open('Erreur lors de l\'approbation de la demande', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  rejectRequest(request: Request): void {
    if (!this.isAdmin && !this.isChef) return;
    
    // Statut différent selon le rôle
    const newStatus = this.isAdmin ? 'admin_rejected' : 'chef_rejected';

    this.requestService.updateRequestStatus(String(request.id), newStatus).subscribe({
      next: () => {
        this.snackBar.open('Demande rejetée', 'Fermer', {
          duration: 3000
        });

        // Générer un ID unique pour les notifications
        const baseId = 'notification-' + new Date().getTime();
        
        if (this.isAdmin) {
          // 1. Notification pour l'admin qui a rejeté la demande
          this.notificationService.addNotification({
            id: baseId + '-admin',
            message: `Vous avez rejeté définitivement la demande de ${request.type}`,
            type: 'warning',
            timestamp: new Date(),
            read: false,
            targetUserId: 'admin-rejection', // Identifiant spécial pour l'admin qui rejette
            link: `/requests/details/${request.id}`
          });
          
          // 2. Notification pour les autres utilisateurs (chef et employés)
          this.notificationService.addNotification({
            id: baseId + '-others',
            message: `L'admin a rejeté définitivement la demande de ${request.type}`,
            type: 'error',
            timestamp: new Date(),
            read: false,
            targetUserId: 'others-admin-rejection', // Identifiant pour les autres utilisateurs
            link: `/requests/details/${request.id}`
          });
        } else { // Si c'est un chef
          // 1. Notification pour le chef qui a rejeté la demande
          this.notificationService.addNotification({
            id: baseId + '-chef',
            message: `Vous avez rejeté la demande de ${request.type}.`,
            type: 'warning',
            timestamp: new Date(),
            read: false,
            targetUserId: 'chef-rejection', // Identifiant spécial pour le chef qui rejette
            link: `/requests/details/${request.id}`
          });
          
          // 2. Notification pour les autres utilisateurs (admin et employés)
          this.notificationService.addNotification({
            id: baseId + '-others',
            message: `Le chef a rejeté la demande de ${request.type}.`,
            type: 'error',
            timestamp: new Date(),
            read: false,
            targetUserId: 'others-chef-rejection', // Identifiant pour les autres utilisateurs
            link: `/requests/details/${request.id}`
          });
        }

        this.loadRequests();
      },
      error: (error) => {
        console.error('Erreur lors du rejet de la demande:', error);
        this.snackBar.open('Erreur lors du rejet de la demande', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  canEdit(request: Request): boolean {
    console.log('Vérification canEdit pour la demande:', request);
    if (this.isAdmin) {
      console.log('Utilisateur admin, édition autorisée');
      return true;
    }
    if (this.isChef) {
      // Le chef peut éditer les demandes de ses subordonnés en attente
      return request.status === 'en attente';
    }
    const userId = String(this.authService.getCurrentUserId());
    const canEdit = String(request.user?.id) === userId && request.status === 'en attente';
    console.log('Résultat canEdit:', canEdit, '(userId:', userId, ', request.user?.id:', request.user?.id, ', status:', request.status, ')');
    return canEdit;
  }

  isEditableRequest(request: Request): boolean {
    console.log('Vérification isEditableRequest pour la demande:', request);
    const isEditable = request.type === 'congé paternité' || request.type === 'congé maternité';
    console.log('Type de congé:', request.type, 'isEditable:', isEditable);
    return this.canEdit(request) && isEditable;
  }

  navigateToEdit(request: Request): void {
    console.log('Tentative de navigation vers l\'édition pour la demande:', request);
    try {
      const requestId = String(request.id);
      console.log('ID de la demande:', requestId);
      
      // Vérification explicite du type de congé
      if (request.type !== 'congé paternité' && request.type !== 'congé maternité') {
        console.log('Type de congé non éditable:', request.type);
        this.snackBar.open('Ce type de congé ne peut pas être édité', 'Fermer', { duration: 3000 });
        return;
      }

      // Navigation vers la page d'édition
      console.log('Navigation vers /requests/edit/' + requestId);
      this.router.navigate(['/requests/edit', requestId]).then(
        (success) => {
          console.log('Résultat de la navigation:', success);
          if (!success) {
            console.error('La navigation a échoué');
            this.snackBar.open('Erreur lors de la navigation', 'Fermer', { duration: 3000 });
          }
        },
        (error) => {
          console.error('Erreur lors de la navigation:', error);
          this.snackBar.open('Erreur lors de la navigation', 'Fermer', { duration: 3000 });
        }
      );
    } catch (error) {
      console.error('Erreur dans navigateToEdit:', error);
      this.snackBar.open('Une erreur est survenue', 'Fermer', { duration: 3000 });
    }
  }
}
