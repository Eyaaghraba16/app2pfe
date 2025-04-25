import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService, Request } from '../requests.service';

@Component({
  selector: 'app-request-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="edit-container" *ngIf="request">
      <div class="edit-card">
        <div class="edit-header">
          <h2>Modifier la demande</h2>
        </div>

        <form (ngSubmit)="onSubmit()" #editForm="ngForm">
          <div class="form-group">
            <label>Type de demande</label>
            <input type="text" [(ngModel)]="request.type" name="type" class="form-control" disabled>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="request.description" name="description" class="form-control" rows="3" required></textarea>
          </div>

          <div class="form-group" *ngIf="request.details?.startDate">
            <label>Date de début</label>
            <input type="date" [(ngModel)]="request.details.startDate" name="startDate" class="form-control" required>
          </div>

          <div class="form-group" *ngIf="request.details?.endDate">
            <label>Date de fin</label>
            <input type="date" [(ngModel)]="request.details.endDate" name="endDate" class="form-control" required>
          </div>

          <div class="form-group" *ngIf="request.details?.reason">
            <label>Motif</label>
            <textarea [(ngModel)]="request.details.reason" name="reason" class="form-control" rows="2" required></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="cancel()">
              <i class="fas fa-times"></i>
              Annuler
            </button>
            <button type="submit" class="btn-save" [disabled]="!editForm.form.valid">
              <i class="fas fa-save"></i>
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .edit-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .edit-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 20px;
    }

    .edit-header {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;

      h2 {
        margin: 0;
        color: #333;
      }
    }

    .form-group {
      margin-bottom: 20px;

      label {
        display: block;
        color: #666;
        font-size: 14px;
        margin-bottom: 5px;
      }

      .form-control {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;

        &:focus {
          outline: none;
          border-color: #007bff;
        }

        &:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
        }
      }

      textarea.form-control {
        resize: vertical;
      }
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;

      button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s;

        i {
          font-size: 16px;
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }

      .btn-cancel {
        background: #f8f9fa;
        color: #333;

        &:hover {
          background: #e2e6ea;
        }
      }

      .btn-save {
        background: #28a745;
        color: white;

        &:hover:not(:disabled) {
          background: #218838;
        }
      }
    }
  `]
})
export class RequestEditComponent implements OnInit {
  request: Request | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService
  ) {}

 ngOnInit() {
     const id = this.route.snapshot.paramMap.get('id');
     if (id) {
         const requestId = Number(id);
         this.request = this.requestsService.getRequestById(requestId);
         
         if (!this.request) {
             this.cancel(); // Redirigez si la demande n'est pas trouvée
         }
     }
 }

  onSubmit() {
    if (this.request) {
      this.requestsService.updateRequest(this.request);
      this.router.navigate(['/home/requests/details', this.request.id]);
    }
  }

  cancel() {
    this.router.navigate(['/home/requests']);
  }
}