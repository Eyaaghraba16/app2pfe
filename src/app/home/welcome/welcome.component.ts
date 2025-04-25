import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RequestsService, Request } from '../requests/requests.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <!-- Header Section -->
      <header class="dashboard-header">
        <h1>Tableau de bord</h1>
        <p class="welcome-message">Bienvenue, {{ getCurrentDate() }}</p>
      </header>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon pending">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-content">
            <h3>En attente</h3>
            <p class="stat-number">{{ getPendingRequests() }}</p>
            <p class="stat-label">Demandes</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon approved">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>Approuvées</h3>
            <p class="stat-number">{{ getApprovedRequests() }}</p>
            <p class="stat-label">Demandes</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon rejected">
            <i class="fas fa-times-circle"></i>
          </div>
          <div class="stat-content">
            <h3>Rejetées</h3>
            <p class="stat-number">{{ getRejectedRequests() }}</p>
            <p class="stat-label">Demandes</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon total">
            <i class="fas fa-list"></i>
          </div>
          <div class="stat-content">
            <h3>Total</h3>
            <p class="stat-number">{{ getTotalRequests() }}</p>
            <p class="stat-label">Demandes</p>
          </div>
        </div>
      </div>

      <!-- Recent Requests -->
      <section class="recent-requests">
        <div class="section-header">
          <h2>Demandes récentes</h2>
          <button class="view-all" (click)="viewAllRequests()">
            Voir tout
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>

        <div class="requests-list">
          <div class="request-item" *ngFor="let request of getRecentRequests()">
            <div class="request-icon" [ngClass]="request.type.toLowerCase()">
              <i class="fas" [ngClass]="{
                'fa-calendar-alt': request.type === 'Congé annuel',
                'fa-graduation-cap': request.type === 'Formation',
                'fa-file-alt': request.type === 'Attestation de travail',
                'fa-money-bill-wave': request.type === 'Prêt',
                'fa-hand-holding-usd': request.type === 'Avance',
                'fa-file-contract': request.type === 'Document'
              }"></i>
            </div>
            <div class="request-details">
              <h3>{{ request.type }}</h3>
              <p>{{ request.description }}</p>
              <span class="request-date">{{ request.date }}</span>
            </div>
            <div class="request-status" [ngClass]="request.status.toLowerCase()">
              {{ request.status }}
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <div class="section-header">
          <h2>Actions rapides</h2>
        </div>
        <div class="actions-grid">
          <button class="action-card" (click)="createNewRequest()">
            <i class="fas fa-plus-circle"></i>
            <span>Nouvelle demande</span>
          </button>
          <button class="action-card" (click)="viewProfile()">
            <i class="fas fa-user"></i>
            <span>Mon profil</span>
          </button>
          <button class="action-card" (click)="viewAllRequests()">
            <i class="fas fa-list-ul"></i>
            <span>Mes demandes</span>
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;

      h1 {
        font-size: 2rem;
        color: #2c3e50;
        margin-bottom: 0.5rem;
      }

      .welcome-message {
        color: #7f8c8d;
        font-size: 1.1rem;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-3px);
      }
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 1.5rem;
        color: white;
      }

      &.pending {
        background: #f1c40f;
      }

      &.approved {
        background: #2ecc71;
      }

      &.rejected {
        background: #e74c3c;
      }

      &.total {
        background: #3498db;
      }
    }

    .stat-content {
      h3 {
        font-size: 0.9rem;
        color: #7f8c8d;
        margin-bottom: 0.3rem;
      }

      .stat-number {
        font-size: 1.8rem;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 0.2rem;
      }

      .stat-label {
        font-size: 0.8rem;
        color: #95a5a6;
      }
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h2 {
        font-size: 1.5rem;
        color: #2c3e50;
      }

      .view-all {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #3498db;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 0.9rem;

        i {
          transition: transform 0.3s ease;
        }

        &:hover i {
          transform: translateX(3px);
        }
      }
    }

    .requests-list {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .request-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #ecf0f1;

      &:last-child {
        border-bottom: none;
      }

      .request-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;

        i {
          color: white;
        }

        &.congé {
          background: #3498db;
        }

        &.formation {
          background: #9b59b6;
        }

        &.attestation {
          background: #1abc9c;
        }

        &.prêt {
          background: #e67e22;
        }

        &.avance {
          background: #f1c40f;
        }

        &.document {
          background: #34495e;
        }
      }

      .request-details {
        flex: 1;

        h3 {
          font-size: 1rem;
          color: #2c3e50;
          margin-bottom: 0.2rem;
        }

        p {
          font-size: 0.9rem;
          color: #7f8c8d;
          margin-bottom: 0.2rem;
        }

        .request-date {
          font-size: 0.8rem;
          color: #95a5a6;
        }
      }

      .request-status {
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;

        &.en.attente {
          background: #fff3cd;
          color: #856404;
        }

        &.approuvée {
          background: #d4edda;
          color: #155724;
        }

        &.rejetée {
          background: #f8d7da;
          color: #721c24;
        }
      }
    }

    .quick-actions {
      margin-top: 2rem;

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .action-card {
        background: white;
        border: none;
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        i {
          font-size: 2rem;
          color: #3498db;
        }

        span {
          font-size: 1rem;
          color: #2c3e50;
          font-weight: 500;
        }

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      }
    }
  `]
})
export class WelcomeComponent implements OnInit {
  requests: Request[] = [];

  constructor(
    private router: Router,
    private requestsService: RequestsService
  ) {}

  ngOnInit() {
    this.requestsService.getRequests().subscribe(requests => {
      this.requests = requests;
    });
  }

  getCurrentDate(): string {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
    const now = new Date();
    return `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  getPendingRequests(): number {
    return this.requests.filter(r => r.status === 'En attente').length;
  }

  getApprovedRequests(): number {
    return this.requests.filter(r => r.status === 'Approuvée').length;
  }

  getRejectedRequests(): number {
    return this.requests.filter(r => r.status === 'Rejetée').length;
  }

  getTotalRequests(): number {
    return this.requests.length;
  }

  getRecentRequests(): Request[] {
    return this.requests.slice(0, 5); // Retourne les 5 dernières demandes
  }

  createNewRequest() {
    this.router.navigate(['/home/requests/new']);
  }

  viewAllRequests() {
    this.router.navigate(['/home/requests']);
  }

  viewProfile() {
    this.router.navigate(['/home/profile']);
  }
}
