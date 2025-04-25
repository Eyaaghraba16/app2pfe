import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request } from '../models/request.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private apiUrl = '/api'; // Ajustez l'URL selon votre configuration

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllRequests(): Request[] {
    // Pour le moment, retournons des données de test
    return [
      {
        id: '1',
        userId: 'user1',
        type: 'Congé annuel',
        requestType: 'congé annuel',
        date: new Date().toISOString(),
        status: 'En attente',
        description: 'Demande de congé annuel',
        details: {},
        user: {
          id: '1',
          name: 'John Doe',
          firstname: 'John',
          lastname: 'Doe',
          role: 'user'
        }
      },
      {
        id: '2',
        userId: 'user2',
        type: 'Document',
        requestType: 'document',
        date: new Date().toISOString(),
        status: 'Approuvée',
        description: 'Demande de document',
        details: {},
        user: {
          id: '2',
          name: 'Jane Smith',
          firstname: 'Jane',
          lastname: 'Smith',
          role: 'user'
        }
      },
      {
        id: '3',
        userId: 'user1',
        type: 'Congé annuel',
        requestType: 'congé annuel',
        date: new Date().toISOString(),
        status: 'Chef approuvé',
        description: 'Demande de congé annuel',
        details: {},
        createdAt: new Date(),
        chefObservation: 'Congé justifié, je recommande l\'approbation',
        chefProcessedBy: 'Chef Equipe',
        chefProcessedDate: new Date().toISOString(),
        user: {
          id: '1',
          name: 'John Doe',
          firstname: 'John',
          lastname: 'Doe',
          role: 'user'
        }
      },
      {
        id: '4',
        userId: 'user2',
        type: 'Formation',
        requestType: 'formation',
        date: new Date().toISOString(),
        status: 'Chef rejeté',
        description: 'Demande de formation',
        details: {},
        createdAt: new Date(),
        chefObservation: 'Formation non pertinente pour le poste actuel',
        chefProcessedBy: 'Chef Equipe',
        chefProcessedDate: new Date().toISOString(),
        user: {
          id: '2',
          name: 'Jane Smith',
          firstname: 'Jane',
          lastname: 'Smith',
          role: 'user'
        }
      }
    ];
  }

  updateRequestStatus(id: string, status: string, response?: string): void {
    // Implémentez la logique de mise à jour du statut
    console.log(`Updating request ${id} to status ${status}`);
    
    // Dans une application réelle, vous feriez un appel API ici
    // Pour le moment, simulons la mise à jour en mémoire
    const currentUser = this.authService.getCurrentUser();
    const requests = this.getAllRequests();
    const requestIndex = requests.findIndex(req => req.id === id);
    
    if (requestIndex !== -1) {
      const request = requests[requestIndex];
      
      // Mise à jour du statut
      request.status = status;
      
      // Si c'est l'admin qui traite une demande déjà traitée par le chef
      if (currentUser?.role === 'ADMIN' && 
          (request.status === 'Chef approuvé' || request.status === 'Chef rejeté')) {
        request.adminResponse = response || '';
        request.adminProcessedBy = currentUser.username || 'Admin';
        request.adminProcessedDate = new Date().toISOString();
      }
      
      // Si c'est le chef qui traite une demande
      if (currentUser?.role === 'CHEF' && request.status === 'En attente') {
        const newStatus = status === 'Approuvée' ? 'Chef approuvé' : 'Chef rejeté';
        request.status = newStatus;
        request.chefObservation = response || '';
        request.chefProcessedBy = currentUser.username || 'Chef';
        request.chefProcessedDate = new Date().toISOString();
      }
      
      // Enregistrer les modifications (dans une vraie application, ce serait un appel API)
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
