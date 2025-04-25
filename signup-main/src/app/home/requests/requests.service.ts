import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface RequestDetails {
  startDate?: string;
  endDate?: string;
  leaveType?: string;
  reason?: string;
  title?: string;
  organization?: string;
  trainingType?: string;
  objectives?: string;
  cost?: number;
  purpose?: string;
  language?: string;
  copies?: number;
  comments?: string;
}

export interface Request {
  id: number;
  type: string;
  status: string;
  date: string;
  description: string;
  details: RequestDetails;
}

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private requests: Request[] = [
    {
      id: 1,
      type: 'Congé annuel',
      status: 'En attente',
      date: '2025-02-20',
      description: 'Demande de congé pour 5 jours',
      details: {
        startDate: '2025-02-20',
        endDate: '2025-02-25',
        leaveType: 'paid',
        reason: 'Vacances'
      }
    },
    {
      id: 2,
      type: 'Formation',
      status: 'Approuvée',
      date: '2025-02-15',
      description: 'Formation Angular avancé',
      details: {
        title: 'Formation Angular',
        organization: 'Formation Pro',
        startDate: '2025-03-01',
        endDate: '2025-03-05',
        trainingType: 'technical',
        objectives: 'Maîtriser Angular',
        cost: 2000
      }
    },
    {
      id: 3,
      type: 'Attestation de travail',
      status: 'Rejetée',
      date: '2025-02-10',
      description: 'Demande d\'attestation de travail',
      details: {
        purpose: 'other',
        language: 'français',
        copies: 2,
        comments: 'Demande d\'attestation de travail'
      }
    }
  ];

  private requestsSubject = new BehaviorSubject<Request[]>(this.requests);

  constructor() {}

  getRequests() {
    return this.requestsSubject.asObservable();
  }

  getRequestById(id: number): Request | undefined {
    return this.requests.find(r => r.id === id);
  }

  updateRequest(updatedRequest: Request) {
    const index = this.requests.findIndex(r => r.id === updatedRequest.id);
    if (index !== -1) {
      this.requests[index] = updatedRequest;
      this.requestsSubject.next(this.requests);
    }
  }

  addRequest(request: Partial<Request>) {
    const newRequest: Request = {
      id: this.requests.length + 1,
      type: request.type || '',
      status: 'En attente',
      date: new Date().toISOString().split('T')[0],
      description: request.description || '',
      details: request.details || {}
    };

    this.requests.unshift(newRequest);
    this.requestsSubject.next(this.requests);
  }

  addLeaveRequest(data: any) {
    const request: Partial<Request> = {
      type: 'Congé annuel',
      description: `Congé du ${data.startDate} au ${data.endDate}`,
      details: {
        startDate: data.startDate,
        endDate: data.endDate,
        leaveType: data.leaveType,
        reason: data.reason
      }
    };
    this.addRequest(request);
  }

  addTrainingRequest(data: any) {
    const request: Partial<Request> = {
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
      }
    };
    this.addRequest(request);
  }

  addCertificateRequest(data: any) {
    const request: Partial<Request> = {
      type: 'Attestation de travail',
      description: `Attestation de travail - ${data.purpose === 'other' ? data.otherPurpose : data.purpose}`,
      details: {
        purpose: data.purpose === 'other' ? data.otherPurpose : data.purpose,
        language: data.language,
        copies: data.copies,
        comments: data.comments
      }
    };
    this.addRequest(request);
  }

  updateLeaveRequest(id: number, data: any) {
    const request = this.getRequestById(id);
    if (request) {
      request.description = `Congé du ${data.startDate} au ${data.endDate}`;
      request.details = {
        startDate: data.startDate,
        endDate: data.endDate,
        leaveType: data.leaveType,
        reason: data.reason
      };
      this.updateRequest(request);
    }
  }

  updateTrainingRequest(id: number, data: any) {
    const request = this.getRequestById(id);
    if (request) {
      request.description = data.title;
      request.details = {
        title: data.title,
        organization: data.organization,
        startDate: data.startDate,
        endDate: data.endDate,
        trainingType: data.trainingType,
        objectives: data.objectives,
        cost: data.cost
      };
      this.updateRequest(request);
    }
  }

  updateCertificateRequest(id: number, data: any) {
    const request = this.getRequestById(id);
    if (request) {
      request.description = `Attestation de travail - ${data.purpose === 'other' ? data.otherPurpose : data.purpose}`;
      request.details = {
        purpose: data.purpose === 'other' ? data.otherPurpose : data.purpose,
        language: data.language,
        copies: data.copies,
        comments: data.comments
      };
      this.updateRequest(request);
    }
  }
}
