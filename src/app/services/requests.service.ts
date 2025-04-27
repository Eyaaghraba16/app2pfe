import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

import { Request } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private apiUrl = '/api'; // Ajustez l'URL selon votre configuration
  private requestsSubject = new BehaviorSubject<Request[]>([]);
  public requests$ = this.requestsSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllRequests(): Request[] {
    return this.requestsSubject.value;
  }

  /**
   * Ajoute une nouvelle demande et met à jour le BehaviorSubject pour une mise à jour en temps réel du calendrier et des vues.
   * Toutes les demandes (congé, document, prêt, formation, attestation, etc.) doivent passer par cette méthode pour garantir la cohérence et la réactivité de l'affichage.
   */
  public addRequest(newRequest: Request): void {
    
    const updated = [...this.requestsSubject.value, newRequest];
    this.requestsSubject.next(updated);
  }  // Mise à jour en temps réel du BehaviorSubject pour une réactivité immédiate

  /**
   * Récupère une demande par son ID (synchroniquement)
   * @param id L'identifiant de la demande
   * @returns La demande correspondante ou undefined
   */
  getRequestById(id: string): Request | undefined {
    return this.requestsSubject.value.find(request => request.id === id);
  }

  /**
   * Met à jour une demande existante (synchroniquement, locale)
   * @param updatedRequest La demande modifiée
   */
  updateRequest(updatedRequest: Request): void {
    const requests = this.requestsSubject.value.slice();
    const index = requests.findIndex(r => r.id === updatedRequest.id);
    if (index !== -1) {
      requests[index] = { ...updatedRequest };
      this.requestsSubject.next(requests);
    }
  }

  updateRequestStatus(id: string, status: string, response?: string): void {
    // Implémentez la logique de mise à jour du statut
    console.log(`Updating request ${id} to status ${status}`);
    const currentUser = this.authService.getCurrentUser();
    const requests = this.requestsSubject.value.slice();
    const requestIndex = requests.findIndex(req => req.id === id);
    if (requestIndex !== -1) {
      const request = requests[requestIndex];
      // Mise à jour du statut
      request.status = status;
      if (currentUser?.role === 'ADMIN' && (request.status === 'Chef approuvé' || request.status === 'Chef rejeté')) {
        request.adminResponse = response || '';
        request.adminProcessedBy = currentUser.username || 'Admin';
        request.adminProcessedDate = new Date().toISOString();
      }
      if (currentUser?.role === 'CHEF' && request.status === 'En attente') {
        const newStatus = status === 'Approuvée' ? 'Chef approuvé' : 'Chef rejeté';
        request.status = newStatus;
        request.chefObservation = response || '';
        request.chefProcessedBy = currentUser.username || 'Chef';
        request.chefProcessedDate = new Date().toISOString();
      }
      // Mettre à jour le BehaviorSubject
      this.requestsSubject.next(requests);
      console.log('Request updated:', request);
    }
  }
  
  // Méthode pour obtenir les demandes qui ont été traitées par le chef et qui attendent la décision de l'admin
  getChefProcessedRequests(): Request[] {
    return this.getAllRequests().filter(request => 
      request.status === 'Chef approuvé' || request.status === 'Chef rejeté'
    );
  }
}
