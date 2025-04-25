import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

export interface RequestDetails {
  startDate?: string;
  endDate?: string;
  leaveType?: string;
  dayPart?: 'full' | 'morning' | 'afternoon';
  reason?: string;
  title?: string;
  organization?: string;
  trainingType?: string;
  objectives?: string;
  cost?: number;
  department?: string;
  theme?: string;
  topic?: string;
  purpose?: string;
  language?: string;
  copies?: number;
  comments?: string;
  workingDays?: number;
  loanAmount?: number;
  loanType?: 'personal' | 'car' | 'house';
  loanReason?: string;
  advanceAmount?: number;
  advanceReason?: string;
  repaymentDate?: string;
  documentType?: string;
  urgency?: boolean;
  additionalInfo?: string;
  attachments?: File[];
}

export interface Request {
  id: string;
  userId: string;
  type: string;
  description: string;
  status: 'En attente' | 'Chef approuvé' | 'Chef rejeté' | 'Approuvée' | 'Rejetée';
  date: string;
  details: RequestDetails;
  response?: string;
  processedBy?: string;
  chefObservation?: string; // Observation du chef pour l'admin
  chefProcessedBy?: string;
  chefProcessedDate?: string;
  adminResponse?: string;
  adminProcessedBy?: string;
  adminProcessedDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private requestsSubject = new BehaviorSubject<Request[]>([]);
  private requests: Request[] = [];

  constructor(private authService: AuthService) {
    // Charger les demandes depuis le localStorage
    const storedRequests = localStorage.getItem('requests');
    if (storedRequests) {
      this.requests = JSON.parse(storedRequests);
      this.requestsSubject.next(this.requests);
    } else {
      // Créer des demandes de test si aucune n'existe
      this.createTestRequests();
    }
  }

  private createTestRequests() {
    // Créer quelques demandes de test
    const testRequests: Request[] = [
      {
        id: 'req-' + Date.now() + '-1',
        userId: 'test-1',
        type: 'congé',
        description: 'Demande de congé annuel',
        status: 'En attente',
        date: new Date().toISOString(),
        details: {
          startDate: '2025-05-01',
          endDate: '2025-05-10',
          leaveType: 'annuel',
          dayPart: 'full',
          reason: 'Vacances d\'été'
        }
      } as Request,
      {
        id: 'req-' + Date.now() + '-2',
        userId: 'test-2',
        type: 'formation',
        description: 'Demande de formation en développement web',
        status: 'En attente',
        date: new Date().toISOString(),
        details: {
          startDate: '2025-06-15',
          endDate: '2025-06-20',
          title: 'Formation Angular avancé',
          organization: 'Tech Academy',
          trainingType: 'technique',
          objectives: 'Améliorer les compétences en Angular',
          cost: 1500
        }
      } as Request,
      {
        id: 'req-' + Date.now() + '-3',
        userId: 'test-3',
        type: 'document',
        description: 'Demande d\'attestation de travail',
        status: 'En attente',
        date: new Date().toISOString(),
        details: {
          documentType: 'attestation',
          urgency: true,
          purpose: 'Démarches administratives'
        }
      } as Request
    ];

    this.requests = testRequests;
    localStorage.setItem('requests', JSON.stringify(this.requests));
    this.requestsSubject.next(this.requests);
    console.log('Demandes de test créées avec succès !');
  }

  getRequests(): Observable<Request[]> {
    // Ne retourner que les demandes de l'utilisateur connecté
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      const userRequests = this.requests.filter(r => r.userId === currentUser.id);
      this.requestsSubject.next(userRequests);
    }
    return this.requestsSubject.asObservable();
  }

  getAllRequests(): Observable<Request[]> {
    // Pour les administrateurs et les managers
    return of(this.requests);
  }

  addLeaveRequest(data: any): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const includeWeekends = data.leaveType === 'annuel' || data.leaveType === 'maternity' || data.leaveType === 'paternity';
    const days = this.calculateWorkingDays(data.startDate, data.endDate, includeWeekends, data.dayPart);
    const dayType = includeWeekends ? 'jours (weekends inclus)' : 'jours ouvrables';
    const dayPart = data.dayPart === 'full' ? '' : 
                   data.dayPart === 'morning' ? ' (matin)' : ' (après-midi)';
    
    // Vérifier la durée légale pour les congés maternité et paternité
    if (data.leaveType === 'maternity') {
      const minDays = 98; // 14 semaines = 98 jours
      if (days < minDays) {
        throw new Error(`Le congé maternité doit être d'au moins ${minDays} jours`);
      }
    } else if (data.leaveType === 'paternity') {
      const minDays = 25; // 25 jours
      if (days < minDays) {
        throw new Error(`Le congé paternité doit être d'au moins ${minDays} jours`);
      }
    }
    
    const leaveTypes: { [key: string]: string } = {
      'annuel': 'Congé annuel',
      'paid': 'Congé payé',
      'unpaid': 'Congé sans solde',
      'sick': 'Congé maladie',
      'maternity': 'Congé maternité',
      'paternity': 'Congé paternité'
    };
    
    const newRequest: Request = {
      type: leaveTypes[data.leaveType],
      description: `Congé du ${data.startDate} au ${data.endDate}${dayPart} (${days} ${dayType})`,
      details: {
        startDate: data.startDate,
        endDate: data.endDate,
        leaveType: data.leaveType,
        dayPart: data.dayPart,
        reason: data.reason,
        workingDays: days
      },
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'En attente',
      date: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
  }

  addTrainingRequest(data: any): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const newRequest: Request = {
      type: 'Formation',
      description: data.title,
      details: {
        title: data.title,
        organization: data.organization,
        startDate: data.startDate,
        endDate: data.endDate,
        trainingType: data.trainingType,
        objectives: data.objectives,
        cost: data.cost
      },
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'En attente',
      date: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
  }

  addCertificateRequest(data: any): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const newRequest: Request = {
      type: 'Attestation de travail',
      description: `Attestation de travail - ${data.purpose === 'other' ? data.otherPurpose : data.purpose}`,
      details: {
        purpose: data.purpose === 'other' ? data.otherPurpose : data.purpose,
        language: data.language,
        copies: data.copies,
        comments: data.comments
      },
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'En attente',
      date: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
  }

  addLoanRequest(data: FormData): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const loanType = (data.get('loanType')?.toString() || 'personal') as 'personal' | 'car' | 'house';
    const loanAmount = Number(data.get('loanAmount'));

    const loanTypes: { [key: string]: string } = {
      'personal': 'Prêt personnel',
      'car': 'Prêt automobile',
      'house': 'Prêt immobilier'
    };

    const newRequest: Request = {
      type: loanTypes[loanType] || 'Prêt',
      description: `Demande de ${loanTypes[loanType] || 'prêt'} de ${loanAmount} DT`,
      details: {
        loanType: loanType,
        loanAmount: loanAmount,
        attachments: Array.from(data.getAll('attachments')).map(file => file as File)
      },
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'En attente',
      date: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveRequests();
    this.getRequests();
  }

  addAdvanceRequest(data: FormData): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const advanceAmount = data.get('advanceAmount');
    const advanceReason = data.get('advanceReason');

    const newRequest: Request = {
      type: 'Avance',
      description: `Demande d'avance de ${advanceAmount} DT`,
      details: {
        advanceAmount: Number(advanceAmount),
        advanceReason: advanceReason?.toString(),
        attachments: Array.from(data.getAll('attachments')).map(file => file as File)
      },
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'En attente',
      date: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
  }

  addDocumentRequest(data: any): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const newRequest: Request = {
      type: 'Document',
      description: `Demande de document - ${data.documentType}`,
      details: {
        documentType: data.documentType,
        urgency: data.urgency,
        additionalInfo: data.additionalInfo
      },
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'En attente',
      date: new Date().toISOString()
    };

    this.requests.push(newRequest);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
  }

  updateLeaveRequest(requestId: string, data: any): boolean {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    // Vérifier que l'utilisateur a le droit de modifier cette demande
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests[index];
    if (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'chef') {
      return false;
    }

    const includeWeekends = data.leaveType === 'annuel' || data.leaveType === 'maternity' || data.leaveType === 'paternity';
    const days = this.calculateWorkingDays(data.startDate, data.endDate, includeWeekends, data.dayPart);
    const dayType = includeWeekends ? 'jours (weekends inclus)' : 'jours ouvrables';
    
    // Vérifier la durée légale pour les congés maternité et paternité
    if (data.leaveType === 'maternity') {
      const minDays = 98; // 14 semaines = 98 jours
      if (days < minDays) {
        throw new Error(`Le congé maternité doit être d'au moins ${minDays} jours`);
      }
    } else if (data.leaveType === 'paternity') {
      const minDays = 25; // 25 jours
      if (days < minDays) {
        throw new Error(`Le congé paternité doit être d'au moins ${minDays} jours`);
      }
    }
    
    const leaveTypes: { [key: string]: string } = {
      'annuel': 'Congé annuel',
      'paid': 'Congé payé',
      'unpaid': 'Congé sans solde',
      'sick': 'Congé maladie',
      'maternity': 'Congé maternité',
      'paternity': 'Congé paternité'
    };
    
    const dayPart = data.dayPart === 'full' ? '' : 
                   data.dayPart === 'morning' ? ' (matin)' : ' (après-midi)';
    this.requests[index] = {
      ...this.requests[index],
      type: leaveTypes[data.leaveType],
      description: `Congé du ${data.startDate} au ${data.endDate}${dayPart} (${days} ${dayType})`,
      details: {
        startDate: data.startDate,
        endDate: data.endDate,
        leaveType: data.leaveType,
        dayPart: data.dayPart,
        reason: data.reason,
        workingDays: days
      }
    };
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  updateTrainingRequest(requestId: string, data: any): boolean {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    // Vérifier que l'utilisateur a le droit de modifier cette demande
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests[index];
    if (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'chef') {
      return false;
    }

    this.requests[index] = {
      ...this.requests[index],
      description: data.title,
      details: {
        title: data.title,
        organization: data.organization,
        startDate: data.startDate,
        endDate: data.endDate,
        trainingType: data.trainingType,
        objectives: data.objectives,
        cost: data.cost
      }
    };
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  updateCertificateRequest(requestId: string, data: any): boolean {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    // Vérifier que l'utilisateur a le droit de modifier cette demande
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests[index];
    if (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'chef') {
      return false;
    }

    this.requests[index] = {
      ...this.requests[index],
      description: `Attestation de travail - ${data.purpose === 'other' ? data.otherPurpose : data.purpose}`,
      details: {
        purpose: data.purpose === 'other' ? data.otherPurpose : data.purpose,
        language: data.language,
        copies: data.copies,
        comments: data.comments
      }
    };
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  updateLoanRequest(requestId: string, data: FormData): boolean {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests[index];
    if (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'chef') {
      return false;
    }

    const loanType = (data.get('loanType')?.toString() || 'personal') as 'personal' | 'car' | 'house';
    const loanAmount = Number(data.get('loanAmount'));

    const loanTypes: { [key: string]: string } = {
      'personal': 'Prêt personnel',
      'car': 'Prêt automobile',
      'house': 'Prêt immobilier'
    };

    this.requests[index] = {
      ...this.requests[index],
      type: loanTypes[loanType] || 'Prêt',
      description: `Demande de ${loanTypes[loanType] || 'prêt'} de ${loanAmount} DT`,
      details: {
        loanType: loanType,
        loanAmount: loanAmount,
        attachments: Array.from(data.getAll('attachments')).map(file => file as File)
      }
    };
    this.saveRequests();
    this.getRequests();
    return true;
  }

  updateAdvanceRequest(requestId: string, data: FormData): boolean {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    // Vérifier que l'utilisateur a le droit de modifier cette demande
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests[index];
    if (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'chef') {
      return false;
    }

    const advanceAmount = data.get('advanceAmount');
    const advanceReason = data.get('advanceReason');

    this.requests[index] = {
      ...this.requests[index],
      description: `Demande d'avance de ${advanceAmount} DT`,
      details: {
        advanceAmount: Number(advanceAmount),
        advanceReason: advanceReason?.toString(),
        attachments: Array.from(data.getAll('attachments')).map(file => file as File)
      }
    };
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  updateDocumentRequest(requestId: string, data: any): boolean {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    // Vérifier que l'utilisateur a le droit de modifier cette demande
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests[index];
    if (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'chef') {
      return false;
    }

    this.requests[index] = {
      ...this.requests[index],
      description: `Demande de document - ${data.documentType}`,
      details: {
        documentType: data.documentType,
        urgency: data.urgency,
        additionalInfo: data.additionalInfo
      }
    };
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  updateRequestStatus(requestId: string, status: 'En attente' | 'Chef approuvé' | 'Chef rejeté' | 'Approuvée' | 'Rejetée', response?: string): Observable<boolean> {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return of(false);

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return of(false);

    const request = this.requests[index];
    const isChef = this.authService.isChef();
    const isAdmin = currentUser.role === 'admin';

    // Vérifier si la demande est de type congé ou formation
    const isLeaveOrTraining = request.type.toLowerCase().includes('congé') || request.type.toLowerCase().includes('formation');

    if (isChef && isLeaveOrTraining) {
      // Le chef ne peut approuver/rejeter que les demandes de congé et formation
      // et seulement si elles sont en attente
      if (request.status !== 'En attente') {
        return of(false);
      }

      // Déterminer le nouveau statut (Chef approuvé ou Chef rejeté)
      const newStatus = status === 'Approuvée' ? 'Chef approuvé' : (status === 'Rejetée' ? 'Chef rejeté' : status);

      this.requests[index] = {
        ...request,
        status: newStatus,
        chefObservation: response, // Utiliser chefObservation au lieu de chefResponse
        chefProcessedBy: currentUser.id,
        chefProcessedDate: new Date().toISOString()
      };
    } else if (isAdmin) {
      // L'admin peut approuver/rejeter toutes les demandes
      // Pour les demandes de congé et formation, l'admin ne peut approuver/rejeter
      // que si elles ont déjà été traitées par un chef
      if (isLeaveOrTraining && 
          request.status !== 'Chef approuvé' && 
          request.status !== 'Chef rejeté') {
        return of(false);
      }

      this.requests[index] = {
        ...request,
        status: status,
        adminResponse: response,
        adminProcessedBy: currentUser.id,
        adminProcessedDate: new Date().toISOString(),
        response: response, // Garder la réponse globale pour la compatibilité
        processedBy: currentUser.id
      };
    } else {
      // Les utilisateurs normaux ne peuvent pas changer le statut des demandes
      return of(false);
    }

    this.saveRequests();
    this.requestsSubject.next(this.requests);
    return of(true);
  }

  deleteRequest(requestId: string): boolean {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return false;

    const request = this.requests.find(r => r.id === requestId);
    if (!request || (request.userId !== currentUser.id && currentUser.role !== 'admin')) {
      return false;
    }

    this.requests = this.requests.filter(r => r.id !== requestId);
    this.saveRequests();
    this.getRequests(); // Mettre à jour la liste des demandes
    return true;
  }

  getRequestById(requestId: string): Request | null {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return null;

    const request = this.requests.find(r => r.id === requestId);
    if (!request || (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'chef')) {
      return null;
    }

    return request;
  }

  private calculateWorkingDays(startDate: string, endDate: string, includeWeekends: boolean = false, dayPart: 'full' | 'morning' | 'afternoon' = 'full'): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let days = 0;
    
    // Clone la date de début pour ne pas la modifier
    const current = new Date(start);
    
    // Boucle sur chaque jour entre les dates
    while (current <= end) {
      // 0 = Dimanche, 6 = Samedi
      const dayOfWeek = current.getDay();
      if (includeWeekends || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
        // Si c'est un demi-jour, on ajoute 0.5, sinon 1
        days += dayPart === 'full' ? 1 : 0.5;
      }
      // Passe au jour suivant
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }

  private saveRequests(): void {
    localStorage.setItem('requests', JSON.stringify(this.requests));
  }
}
