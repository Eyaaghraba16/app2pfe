import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Request } from '../models/request.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = `${environment.apiUrl}/requests`;

  constructor(private http: HttpClient) {}

  getAllRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/all`);
  }

  getUserRequests(userId: string): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/user/${userId}`);
  }

  getRequest(requestId: string): Observable<Request> {
    return this.http.get<Request>(`${this.apiUrl}/${requestId}`);
  }

  createRequest(request: Partial<Request>): Observable<Request> {
    return this.http.post<Request>(this.apiUrl, request);
  }

  updateRequest(request: Request): Observable<Request> {
    return this.http.put<Request>(`${this.apiUrl}/${request.id}`, request);
  }

  updateRequestStatus(requestId: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${requestId}/status`, { status });
  }
  
  getSubordinatesRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.apiUrl}/subordinates`);
  }
}
