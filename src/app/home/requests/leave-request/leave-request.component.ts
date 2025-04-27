import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestsService } from '../requests.service';

import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LeaveRequestComponent implements OnInit {
  // Données du formulaire
  // Données du formulaire et état
  request = {
    startDate: '',
    endDate: '',
    leaveType: '',
    dayPart: 'full' as 'full' | 'morning' | 'afternoon',
    reason: '',
    documents: null as File | null
  };
  editMode: boolean = false;
  requestId: string | null = null;

  // Feedback utilisateur
  isSubmitting: boolean = false;
  submitError: string | null = null;
  submitSuccess: string | null = null;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestsService: RequestsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.requestId = id;
      this.requestsService.getRequestById(id).subscribe(existingRequest => {
        if (existingRequest && existingRequest.details) {
          this.request = {
            startDate: existingRequest.details.startDate || '',
            endDate: existingRequest.details.endDate || '',
            leaveType: existingRequest.details.leaveType || '',
            dayPart: existingRequest.details.dayPart || 'full',
            reason: existingRequest.details.reason || '',
            documents: null
          };
        }
      });
    }
  }

  onStartDateChange(event: Event) {
    const startDate = (event.target as HTMLInputElement).value;
    if ((this.request.leaveType === 'maternity' || this.request.leaveType === 'paternity') && startDate) {
      // Calculate end date based on leave type
      const days = this.request.leaveType === 'maternity' ? 98 : 25; // 98 days for maternity (14 weeks)
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + days);
      
      // Format the date as YYYY-MM-DD
      this.request.endDate = end.toISOString().split('T')[0];
    }
  }

  onLeaveTypeChange() {
    if ((this.request.leaveType === 'maternity' || this.request.leaveType === 'paternity') && this.request.startDate) {
      // Calculate end date based on leave type
      const days = this.request.leaveType === 'maternity' ? 98 : 25; // 98 days for maternity (14 weeks)
      const start = new Date(this.request.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + days);
      this.request.endDate = end.toISOString().split('T')[0];
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.request.documents = file;
    }
  }

  onSubmit() {
    this.isSubmitting = true;
    this.submitError = null;
    this.submitSuccess = null;
    if (this.editMode && this.requestId) {
      // On suppose que updateLeaveRequest retourne un Observable, sinon il faut adapter le service !
      this.requestsService.updateLeaveRequest(this.requestId, this.request).subscribe({
        next: () => {
          this.submitSuccess = "Demande modifiée avec succès.";
          this.isSubmitting = false;
          setTimeout(() => this.router.navigate(['/home/requests']), 1000);
        },
        error: (_err: any) => {
          this.submitError = "Erreur lors de la modification de la demande.";
          this.isSubmitting = false;
        }
      });
    } else {
      // Construction de l'objet Request pour addRequest
      const currentUser = this.authService.currentUserValue;
      const newRequest = {
        requestType: 'leave',
        id: Math.random().toString(36).substr(2, 9),
        type: "Congé",
        date: new Date().toISOString(),
        status: 'En attente',
        userId: currentUser?.id || '',
        details: {
          startDate: this.request.startDate,
          endDate: this.request.endDate,
          leaveType: this.request.leaveType,
          dayPart: this.request.dayPart,
          reason: this.request.reason,
          documents: this.request.documents as any
        },
        description: `Demande de congé du ${this.request.startDate} au ${this.request.endDate}`,
        createdAt: new Date().toISOString(),
        user: currentUser,
      };
      // On suppose que addRequest retourne un Observable, sinon il faut adapter le service !
      this.requestsService.addRequest(newRequest).subscribe({
        next: () => {
          this.submitSuccess = "Demande envoyée avec succès.";
          this.isSubmitting = false;
          setTimeout(() => this.router.navigate(['/home/requests']), 1000);
        },
        error: (_err: any) => {
          this.submitError = "Erreur lors de l'envoi de la demande.";
          this.isSubmitting = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/home/requests']);
  }
}
