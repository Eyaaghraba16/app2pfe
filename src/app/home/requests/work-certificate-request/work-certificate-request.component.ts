import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-work-certificate-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h2>Demande d'Attestation de Travail</h2>
      </div>

      <form (ngSubmit)="onSubmit()" #certificateForm="ngForm">
        <div class="form-group">
          <label>Motif de la demande</label>
          <select [(ngModel)]="request.purpose" name="purpose" required>
            <option value="bank">Demande bancaire</option>
            <option value="visa">Demande de visa</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div class="form-group" *ngIf="request.purpose === 'other'">
          <label>Précisez le motif</label>
          <input type="text" [(ngModel)]="request.otherPurpose" name="otherPurpose" required>
        </div>

        <div class="form-group">
          <label>Langue souhaitée</label>
          <select [(ngModel)]="request.language" name="language" required>
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
            <option value="ar">Arabe</option>
          </select>
        </div>

        <div class="form-group">
          <label>Nombre de copies</label>
          <input type="number" [(ngModel)]="request.copies" name="copies" min="1" max="5" required>
          <small>Maximum 5 copies</small>
        </div>

        <div class="form-group">
          <label>Commentaires additionnels</label>
          <textarea [(ngModel)]="request.comments" name="comments" rows="4"></textarea>
        </div>

        <div class="form-group">
          <label>Documents justificatifs (si nécessaire)</label>
          <input type="file" (change)="onFileSelected($event)" accept=".pdf,.doc,.docx">
          <small>Formats acceptés: PDF, DOC, DOCX</small>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="cancel()">
            <i class='bx bx-x'></i>
            Annuler
          </button>
          <button type="submit" class="btn-submit" [disabled]="!certificateForm.form.valid">
            <i class='bx bx-check'></i>
            Soumettre
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-header {
      text-align: center;
      margin-bottom: 30px;

      h2 {
        color: #333;
      }
    }

    .form-group {
      margin-bottom: 20px;

      label {
        display: block;
        margin-bottom: 5px;
        color: #555;
      }

      input[type="text"],
      input[type="number"],
      input[type="file"],
      select,
      textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;

        &:focus {
          outline: none;
          border-color: #007bff;
        }
      }

      textarea {
        resize: vertical;
      }

      small {
        display: block;
        margin-top: 5px;
        color: #666;
      }
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 30px;

      button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s;

        i {
          font-size: 20px;
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }

      .btn-cancel {
        background: #6c757d;
        color: white;

        &:hover {
          background: #5a6268;
        }
      }

      .btn-submit {
        background: #28a745;
        color: white;

        &:hover:not(:disabled) {
          background: #218838;
        }
      }
    }
  `]
})
export class WorkCertificateRequestComponent implements OnInit {
  requestId: string | null = null;
  request = {
    purpose: '',
    otherPurpose: '',
    language: '',
    copies: 1,
    comments: '',
    documents: null as File | null
  };

  editMode = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestsService: RequestsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestId = id;
      this.editMode = true;
      const existingRequest = this.requestsService.getRequestById(id);
      if (existingRequest && existingRequest.details) {
        this.request = {
          purpose: existingRequest.details.purpose || '',
          otherPurpose: existingRequest.details.purpose === 'other' ? existingRequest.details.purpose : '',
          language: existingRequest.details.language || '',
          copies: existingRequest.details.copies || 1,
          comments: existingRequest.details.comments || '',
          documents: null
        };
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.request.documents = file;
    }
  }

  onSubmit() {
    if (this.requestId) {
      this.requestsService.updateCertificateRequest(this.requestId, this.request);
    } else {
      this.requestsService.addCertificateRequest(this.request);
    }
    this.router.navigate(['/home/requests']);
  }

  cancel() {
    this.router.navigate(['/home/requests']);
  }
}
