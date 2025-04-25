import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { NotificationService } from '../../services/notification.service';

// Interface pour la réponse de mise à jour du statut
export interface UpdateStatusResponse {
  success: boolean;
  notifications?: {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
    read: boolean;
    link?: string;
  }[];
}

// Interface pour les détails d'une demande
export interface RequestDetails {
  startDate?: string;
  endDate?: string;
  days?: number;
  dayType?: string;
  reason?: string;
  certificateType?: string;
  documentType?: string;
  amount?: number;
  repaymentPeriod?: number;
  trainingName?: string;
  trainingProvider?: string;
  trainingDuration?: string;
  trainingCost?: number;
  includeWeekends?: boolean;
  leaveType?: string;
  dayPart?: 'full' | 'morning' | 'afternoon';
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
  urgency?: 'low' | 'medium' | 'high';
  additionalInfo?: string;
  attachments?: File[];
}

// Interface pour une demande
export interface Request {
  id: string;
  userId: string;
  type: string;
  date: string;
  status: 'En attente' | 'Chef approuvé' | 'Chef rejeté' | 'Approuvée' | 'Rejetée';
  description: string;
  details: RequestDetails;
  user?: {
    id: string;
    name?: string;
    firstname?: string;
    lastname?: string;
    role?: string;
  };
  createdAt?: Date;
  chefObservation?: string;
  chefProcessedBy?: string;
  chefProcessedDate?: string;
  adminResponse?: string;
  adminProcessedBy?: string;
  adminProcessedDate?: string;
  response?: string;
  processedBy?: string;
  urgency?: 'low' | 'medium' | 'high';
}

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private requestsSubject = new BehaviorSubject<Request[]>([]);
  private requests: Request[] = [];
  private leaveTypes: { [key: string]: string } = {
    'annuel': 'Congé annuel',
    'paid': 'Congé payé',
    'unpaid': 'Congé sans solde',
    'sick': 'Congé maladie',
    'maternity': 'Congé maternité',
    'paternity': 'Congé paternité'
  };

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
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

  // Sauvegarde les demandes dans le localStorage et met à jour le BehaviorSubject
  saveRequests(): void {
    localStorage.setItem('requests', JSON.stringify(this.requests));
    this.requestsSubject.next(this.requests);
  }

  // Retourne un Observable de toutes les demandes
  getRequests(): Observable<Request[]> {
    return this.requestsSubject.asObservable();
  }

  // Alias pour getRequests() - utilisé pour la compatibilité
  getAllRequests(): Observable<Request[]> {
    return this.getRequests();
  }

  // Récupère une demande par son ID (version Observable)
  // @param id L'identifiant de la demande
  getRequestById(id: string): Observable<Request | undefined> {
    return this.getRequests().pipe(
      map(requests => requests.find(request => request.id === id))
    );
  }

  // Récupère une demande par son ID (version synchrone)
  // @param requestId L'identifiant de la demande
  findRequestById(requestId: string): Request | null {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return null;

    const request = this.requests.find(r => r.id === requestId);
    if (!request || (request.userId !== currentUser.id && currentUser.role !== 'admin' && currentUser.role !== 'chef')) {
      return null;
    }

    return request;
  }

  // Filtre les demandes en fonction du rôle de l'utilisateur
  // @param userId L'identifiant de l'utilisateur
  // @param role Le rôle de l'utilisateur (admin, chef, employee)
  getRequestsByUserRole(userId: string, role: string): Observable<Request[]> {
    if (role === 'admin') {
      // L'admin voit toutes les demandes
      return this.getRequests();
    } else if (role === 'chef') {
      // Le chef ne voit que les demandes de congés et de formation
      return this.getRequests().pipe(
        map(requests => requests.filter(request => 
          (request.type === 'Congé' || request.type === 'Formation') && 
          request.status === 'En attente'
        ))
      );
    } else {
      // L'employé ne voit que ses propres demandes
      return this.getUserRequests(userId);
    }
  }

  // Filtre les demandes par type
  // @param type Le type de demande à filtrer
  filterRequestsByType(type: string): Observable<Request[]> {
    return this.getRequests().pipe(
      map(requests => requests.filter(request => request.type === type))
    );
  }

  // Filtre les demandes par statut
  // @param status Le statut de demande à filtrer
  filterRequestsByStatus(status: string): Observable<Request[]> {
    return this.getRequests().pipe(
      map(requests => requests.filter(request => request.status === status))
    );
  }

  // Récupère les demandes d'un utilisateur spécifique
  // @param userId L'identifiant de l'utilisateur
  getUserRequests(userId: string): Observable<Request[]> {
    return this.getRequests().pipe(
      map(requests => requests.filter(request => request.userId === userId))
    );
  }

  // Méthode pour créer une nouvelle demande
  createRequest(requestData: Partial<Request>): string {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return '';

    const newRequest: Request = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: currentUser.id,
      type: requestData.type || 'Autre',
      date: new Date().toISOString(),
      status: 'En attente',
      description: requestData.description || '',
      details: requestData.details || {},
      user: {
        id: currentUser.id,
        firstname: currentUser.firstName || '',
        lastname: currentUser.lastName || '',
        role: currentUser.role
      },
      createdAt: new Date(),
      urgency: requestData.urgency || 'low'
    };

    this.requests.push(newRequest);
    this.saveRequests();

    // Créer une notification pour les chefs
    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      message: `Nouvelle demande de ${newRequest.type.toLowerCase()} de ${currentUser.firstName || ''} ${currentUser.lastName || ''}`,
      type: 'info' as 'info',
      timestamp: new Date(),
      read: false,
      link: `/home/requests/${newRequest.id}`
    };

    this.notificationService.addNotification(notification);
    return newRequest.id;
  }

  // Méthode pour mettre à jour le statut d'une demande
  updateRequestStatus(requestId: string, status: 'En attente' | 'Chef approuvé' | 'Chef rejeté' | 'Approuvée' | 'Rejetée', response?: string): Observable<UpdateStatusResponse> {
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return of({ success: false });

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return of({ success: false });

    const request = this.requests[index];
    const isChef = this.authService.isChef();
    const isAdmin = currentUser.role === 'admin';

    // Vérifier si la demande est de type congé ou formation
    const isLeaveOrTraining = request.type.toLowerCase().includes('congé') || request.type.toLowerCase().includes('formation');

    // Préparer les notifications
    const notifications = [];

    if (isChef && isLeaveOrTraining) {
      // Le chef ne peut approuver/rejeter que les demandes de congé et formation
      // et seulement si elles sont en attente
      if (request.status !== 'En attente') {
        return of({ success: false });
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

      // Créer des notifications
      const employeeNotification = {
        id: Date.now().toString(),
        message: `Votre demande de ${request.type} a été ${newStatus === 'Chef approuvé' ? 'approuvée' : 'rejetée'} par le chef.`,
        type: newStatus === 'Chef approuvé' ? 'success' : 'warning' as 'success' | 'warning',
        timestamp: new Date(),
        read: false,
        link: `/home/requests/details/${requestId}`
      };

      const adminNotification = {
        id: (Date.now() + 1).toString(),
        message: `Une demande de ${request.type} a été ${newStatus === 'Chef approuvé' ? 'approuvée' : 'rejetée'} par le chef.`,
        type: 'info' as 'info',
        timestamp: new Date(),
        read: false,
        link: `/admin/requests/details/${requestId}`
      };

      notifications.push(employeeNotification, adminNotification);
      
      // Ajouter les notifications au service de notification
      if (this.notificationService) {
        notifications.forEach(notification => {
          this.notificationService.addNotification(notification);
        });
      }
    } else if (isAdmin) {
      // L'admin peut approuver/rejeter toutes les demandes
      // Pour les demandes de congé et formation, l'admin ne peut approuver/rejeter
      // que si elles ont déjà été traitées par un chef
      if (isLeaveOrTraining && 
          request.status !== 'Chef approuvé' && 
          request.status !== 'Chef rejeté') {
        return of({ success: false });
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

      // Créer une notification pour l'employé
      const employeeNotification = {
        id: Date.now().toString(),
        message: `Votre demande de ${request.type} a été ${status === 'Approuvée' ? 'approuvée' : 'rejetée'} définitivement.`,
        type: status === 'Approuvée' ? 'success' : 'error' as 'success' | 'error',
        timestamp: new Date(),
        read: false,
        link: `/home/requests/details/${requestId}`
      };

      notifications.push(employeeNotification);
      
      // Ajouter les notifications au service de notification
      if (this.notificationService) {
        notifications.forEach(notification => {
          this.notificationService.addNotification(notification);
        });
      }
    } else {
      // Les utilisateurs normaux ne peuvent pas changer le statut des demandes
      return of({ success: false });
    }

    this.saveRequests();
    return of({ success: true, notifications });
  }

  // Méthode pour calculer les jours ouvrables entre deux dates
  calculateWorkingDays(startDate: string, endDate: string, includeWeekends: boolean = false, dayPart: 'full' | 'morning' | 'afternoon' = 'full'): number {
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

  // Méthode pour créer des demandes de test
  private createTestRequests(): void {
    // Créer quelques demandes de test
    const testRequests: Request[] = [
      // Exemples de demandes
      {
        id: '1',
        userId: '1',
        type: 'Congé',
        date: new Date().toISOString(),
        status: 'En attente',
        description: 'Demande de congé annuel',
        details: {
          startDate: '2023-07-01',
          endDate: '2023-07-10',
          days: 7,
          leaveType: 'Congé annuel',
          reason: 'Vacances d\'été'
        },
        user: {
          id: '1',
          firstname: 'John',
          lastname: 'Doe',
          role: 'employee'
        },
        createdAt: new Date()
      },
      {
        id: '2',
        userId: '2',
        type: 'Formation',
        date: new Date().toISOString(),
        status: 'En attente',
        description: 'Demande de formation Angular',
        details: {
          trainingName: 'Formation Angular avancée',
          trainingProvider: 'Formation Tech',
          trainingDuration: '5 jours',
          trainingCost: 1500,
          startDate: '2023-08-01',
          endDate: '2023-08-05'
        },
        user: {
          id: '2',
          firstname: 'Jane',
          lastname: 'Smith',
          role: 'employee'
        },
        createdAt: new Date()
      }
    ];

    this.requests = testRequests;
    this.saveRequests();
  }

  // Méthode pour ajouter une nouvelle demande de congé
  addLeaveRequest(data: {
    startDate: string;
    endDate: string;
    leaveType: string;
    reason: string;
    dayType?: string;
    dayPart?: 'full' | 'morning' | 'afternoon';
    includeWeekends?: boolean;
  }): string {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return '';

    // Calculer le nombre de jours de congé
    const workingDays = this.calculateWorkingDays(
      data.startDate,
      data.endDate,
      data.includeWeekends || false,
      data.dayPart || 'full'
    );

    // Créer une nouvelle demande
    return this.createRequest({
      type: 'Congé',
      description: `Demande de ${data.leaveType}`,
      details: {
        startDate: data.startDate,
        endDate: data.endDate,
        days: workingDays,
        leaveType: data.leaveType,
        reason: data.reason,
        dayType: data.dayType || 'full',
        dayPart: data.dayPart || 'full',
        includeWeekends: data.includeWeekends || false
      }
    });
  }

  // Méthode pour ajouter une nouvelle demande de formation
  addTrainingRequest(data: {
    title: string;
    organization: string;
    startDate: string;
    endDate: string;
    trainingType: string;
    objectives: string;
    cost: number;
    department?: string;
    theme?: string;
    topic?: string;
  }): string {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return '';

    return this.createRequest({
      type: 'Formation',
      description: data.title,
      details: {
        title: data.title,
        organization: data.organization,
        startDate: data.startDate,
        endDate: data.endDate,
        trainingType: data.trainingType,
        objectives: data.objectives,
        cost: data.cost,
        department: data.department,
        theme: data.theme,
        topic: data.topic
      }
    });
  }

  // Méthode pour ajouter une nouvelle demande de certificat
  addCertificateRequest(data: {
    purpose: string;
    otherPurpose?: string;
    language: string;
    copies: number;
    comments?: string;
  }): string {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return '';

    return this.createRequest({
      type: 'Attestation de travail',
      description: `Attestation de travail - ${data.purpose === 'other' ? data.otherPurpose : data.purpose}`,
      details: {
        purpose: data.purpose === 'other' ? data.otherPurpose : data.purpose,
        language: data.language,
        copies: data.copies,
        comments: data.comments
      }
    });
  }

  // Méthode pour ajouter une nouvelle demande de document
  addDocumentRequest(data: {
    documentType: string;
    urgency: 'low' | 'medium' | 'high';
    additionalInfo?: string;
  }): string {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return '';

    return this.createRequest({
      type: 'Document',
      description: `Demande de document - ${data.documentType}`,
      details: {
        documentType: data.documentType,
        urgency: data.urgency,
        additionalInfo: data.additionalInfo
      }
    });
  }

  // Méthode pour ajouter une nouvelle demande de prêt
  addLoanRequest(data: FormData): string {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return '';

    const loanType = (data.get('loanType')?.toString() || 'personal') as 'personal' | 'car' | 'house';
    const loanAmount = Number(data.get('loanAmount'));

    const loanTypes: { [key: string]: string } = {
      'personal': 'Prêt personnel',
      'car': 'Prêt automobile',
      'house': 'Prêt immobilier'
    };

    return this.createRequest({
      type: loanTypes[loanType] || 'Prêt',
      description: `Demande de ${loanTypes[loanType] || 'prêt'} de ${loanAmount} DT`,
      details: {
        loanType: loanType,
        loanAmount: loanAmount,
        attachments: Array.from(data.getAll('attachments')).map(file => file as File)
      }
    });
  }

  // Méthode pour ajouter une nouvelle demande d'avance
  addAdvanceRequest(data: FormData): string {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return '';

    const advanceAmount = data.get('advanceAmount');
    const advanceReason = data.get('advanceReason');

    return this.createRequest({
      type: 'Avance',
      description: `Demande d'avance de ${advanceAmount} DT`,
      details: {
        advanceAmount: Number(advanceAmount),
        advanceReason: advanceReason?.toString(),
        attachments: Array.from(data.getAll('attachments')).map(file => file as File)
      }
    });
  }

  // Méthode pour mettre à jour une demande de congé
  updateLeaveRequest(requestId: string, data: {
    startDate: string;
    endDate: string;
    leaveType: string;
    reason: string;
    dayPart?: 'full' | 'morning' | 'afternoon';
    includeWeekends?: boolean;
  }): boolean {
    const request = this.findRequestById(requestId);
    if (!request) return false;

    const includeWeekends = data.leaveType === 'annuel' || data.leaveType === 'maternity' || data.leaveType === 'paternity';
    const days = this.calculateWorkingDays(data.startDate, data.endDate, includeWeekends, data.dayPart);
    const dayType = includeWeekends ? 'jours (weekends inclus)' : 'jours ouvrables';
    const dayPart = data.dayPart === 'full' ? '' : 
                   data.dayPart === 'morning' ? ' (matin)' : ' (après-midi)';
    
    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;
    
    this.requests[index] = {
      ...this.requests[index],
      type: this.leaveTypes[data.leaveType],
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
    return true;
  }

  // Méthode pour mettre à jour une demande de formation
  updateTrainingRequest(requestId: string, data: {
    title: string;
    organization: string;
    startDate: string;
    endDate: string;
    trainingType: string;
    objectives: string;
    cost: number;
    department?: string;
    theme?: string;
    topic?: string;
  }): boolean {
    const request = this.findRequestById(requestId);
    if (!request) return false;

    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    this.requests[index] = {
      ...this.requests[index],
      description: data.title,
      details: {
        ...this.requests[index].details,
        title: data.title,
        organization: data.organization,
        startDate: data.startDate,
        endDate: data.endDate,
        trainingType: data.trainingType,
        objectives: data.objectives,
        cost: data.cost,
        department: data.department,
        theme: data.theme,
        topic: data.topic
      }
    };
    
    this.saveRequests();
    return true;
  }

  // Méthode pour mettre à jour une demande de certificat
  updateCertificateRequest(requestId: string, data: {
    purpose: string;
    otherPurpose?: string;
    language: string;
    copies: number;
    comments?: string;
  }): boolean {
    const request = this.findRequestById(requestId);
    if (!request) return false;

    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    this.requests[index] = {
      ...this.requests[index],
      description: `Attestation de travail - ${data.purpose === 'other' ? data.otherPurpose : data.purpose}`,
      details: {
        ...this.requests[index].details,
        purpose: data.purpose === 'other' ? data.otherPurpose : data.purpose,
        language: data.language,
        copies: data.copies,
        comments: data.comments
      }
    };
    
    this.saveRequests();
    return true;
  }

  // Méthode pour mettre à jour une demande de document
  updateDocumentRequest(requestId: string, data: {
    documentType: string;
    urgency: 'low' | 'medium' | 'high';
    additionalInfo?: string;
  }): boolean {
    const request = this.findRequestById(requestId);
    if (!request) return false;

    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    this.requests[index] = {
      ...this.requests[index],
      description: `Demande de document - ${data.documentType}`,
      details: {
        ...this.requests[index].details,
        documentType: data.documentType,
        urgency: data.urgency,
        additionalInfo: data.additionalInfo
      }
    };
    
    this.saveRequests();
    return true;
  }

  // Méthode pour mettre à jour une demande de prêt
  updateLoanRequest(requestId: string, data: FormData): boolean {
    const request = this.findRequestById(requestId);
    if (!request) return false;

    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

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
        ...this.requests[index].details,
        loanType: loanType,
        loanAmount: loanAmount,
        attachments: Array.from(data.getAll('attachments')).map(file => file as File)
      }
    };
    
    this.saveRequests();
    return true;
  }

  // Méthode pour mettre à jour une demande d'avance
  updateAdvanceRequest(requestId: string, data: FormData): boolean {
    const request = this.findRequestById(requestId);
    if (!request) return false;

    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    const advanceAmount = data.get('advanceAmount');
    const advanceReason = data.get('advanceReason');

    this.requests[index] = {
      ...this.requests[index],
      description: `Demande d'avance de ${advanceAmount} DT`,
      details: {
        ...this.requests[index].details,
        advanceAmount: Number(advanceAmount),
        advanceReason: advanceReason?.toString(),
        attachments: Array.from(data.getAll('attachments')).map(file => file as File)
      }
    };
    
    this.saveRequests();
    return true;
  }

  // Méthode pour supprimer une demande
  deleteRequest(requestId: string): boolean {
    const request = this.findRequestById(requestId);
    if (!request) return false;

    const index = this.requests.findIndex(r => r.id === requestId);
    if (index === -1) return false;

    this.requests.splice(index, 1);
    this.saveRequests();
    return true;
  }
}
