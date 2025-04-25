import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService, Request } from '../requests.service';

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="details-container" *ngIf="request">
      <div class="header">
        <h2>Détails de la Demande</h2>
        <button class="btn-back" (click)="goBack()">
          <i class='bx bx-arrow-back'></i>
          Retour
        </button>
      </div>

      <div class="request-info">
        <div class="info-group">
          <label>Type:</label>
          <span>{{ request.type }}</span>
        </div>

        <div class="info-group">
          <label>Statut:</label>
          <span [class]="{'status-en-attente': request.status === 'En attente',
                         'status-approuvée': request.status === 'Approuvée',
                         'status-rejetée': request.status === 'Rejetée'}">
            {{ request.status }}
          </span>
        </div>

        <div class="info-group">
          <label>Date:</label>
          <span>{{ request.date }}</span>
        </div>

        <div class="info-group">
          <label>Description:</label>
          <span>{{ request.description }}</span>
        </div>

        <ng-container *ngIf="request.details">
          <div class="details-section">
            <h3>Informations supplémentaires</h3>
            
            <ng-container *ngIf="request.type === 'Congé annuel'">
              <div class="info-group">
                <label>Date de début:</label>
                <span>{{ request.details.startDate }}</span>
              </div>
              <div class="info-group">
                <label>Date de fin:</label>
                <span>{{ request.details.endDate }}</span>
              </div>
              <div class="info-group">
                <label>Type de congé:</label>
                <span>{{ request.details.leaveType }}</span>
              </div>
              <div class="info-group">
                <label>Motif:</label>
                <span>{{ request.details.reason }}</span>
              </div>
            </ng-container>

            <ng-container *ngIf="request.type === 'Formation'">
              <div class="info-group">
                <label>Titre:</label>
                <span>{{ request.details.title }}</span>
              </div>
              <div class="info-group">
                <label>Organisme:</label>
                <span>{{ request.details.organization }}</span>
              </div>
              <div class="info-group">
                <label>Date de début:</label>
                <span>{{ request.details.startDate }}</span>
              </div>
              <div class="info-group">
                <label>Date de fin:</label>
                <span>{{ request.details.endDate }}</span>
              </div>
              <div class="info-group">
                <label>Objectifs:</label>
                <span>{{ request.details.objectives }}</span>
              </div>
              <div class="info-group">
                <label>Coût:</label>
                <span>{{ request.details.cost }} DH</span>
              </div>
            </ng-container>

            <ng-container *ngIf="request.type === 'Attestation de travail'">
              <div class="info-group">
                <label>Motif:</label>
                <span>{{ request.details.purpose }}</span>
              </div>
              <div class="info-group">
                <label>Langue:</label>
                <span>{{ request.details.language }}</span>
              </div>
              <div class="info-group">
                <label>Nombre de copies:</label>
                <span>{{ request.details.copies }}</span>
              </div>
              <div class="info-group" *ngIf="request.details.comments">
                <label>Commentaires:</label>
                <span>{{ request.details.comments }}</span>
              </div>
            </ng-container>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .details-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;

      h2 {
        margin: 0;
        color: #333;
      }
    }

    .btn-back {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #6c757d;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background: #5a6268;
      }

      i {
        font-size: 20px;
      }
    }

    .request-info {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .info-group {
      margin-bottom: 15px;

      label {
        display: block;
        color: #666;
        margin-bottom: 5px;
        font-weight: 500;
      }

      span {
        color: #333;
      }
    }

    .details-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;

      h3 {
        color: #333;
        margin-bottom: 20px;
      }
    }

    .status-en-attente {
      color: #ffc107;
    }
    .status-approuvée {
      color: #28a745;
    }
    .status-rejetée {
      color: #dc3545;
    }
  `]
})
export class RequestDetailsComponent implements OnInit {
  request: Request | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.requestsService.getRequests().subscribe(requests => {
      this.request = requests.find(r => r.id === id);
      if (!this.request) {
        this.goBack();
      }
    });
  }

  goBack() {
    this.router.navigate(['/home/requests']);
  }
}
