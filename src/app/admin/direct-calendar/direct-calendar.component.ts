import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-direct-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="calendar-container">
      <h2>Calendrier des demandes</h2>
      
      <div class="calendar-navigation">
        <button class="nav-btn">
          <i class="fas fa-chevron-left"></i> Précédent
        </button>
        <h3 class="current-month">Mars 2024</h3>
        <button class="nav-btn">
          Suivant <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div class="calendar-wrapper">
        <div class="calendar-grid">
          <!-- Jours de la semaine -->
          <div class="weekday" *ngFor="let day of weekdays">
            {{ day }}
          </div>
          
          <!-- Jours du mois -->
          <ng-container *ngFor="let day of days">
            <div class="day">
              <div class="day-header">{{ day.number }}</div>
              <div class="day-content">
                <div class="request-item status-pending" *ngIf="day.number === 3">
                  Congé annuel - Employé 4
                </div>
                <div class="request-item status-pending" *ngIf="day.number === 3">
                  Congé annuel - Employé 5
                </div>
                <div class="request-item status-pending" *ngIf="day.number === 9">
                  Attestation de travail - Employé 2
                </div>
                <div class="request-item status-approved" *ngIf="day.number === 9">
                  Congé annuel - Employé 3
                </div>
                <div class="request-item status-pending" *ngIf="day.number === 13">
                  Attestation de travail - Employé 1
                </div>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
      
      <div class="legend">
        <div class="legend-item">
          <span class="legend-color status-approved"></span>
          <span>Approuvée</span>
        </div>
        <div class="legend-item">
          <span class="legend-color status-rejected"></span>
          <span>Rejetée</span>
        </div>
        <div class="legend-item">
          <span class="legend-color status-chef-approved"></span>
          <span>Approuvée par le chef</span>
        </div>
        <div class="legend-item">
          <span class="legend-color status-pending"></span>
          <span>En attente</span>
        </div>
      </div>
      
      <button class="return-btn" routerLink="/admin">Retour à l'accueil</button>
    </div>
  `,
  styles: [`
    .calendar-container {
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }

    h2 {
      margin-bottom: 20px;
      color: #333;
      font-weight: 600;
    }

    .calendar-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .current-month {
      font-size: 1.5rem;
      font-weight: 500;
      margin: 0;
    }
    
    .nav-btn {
      background: none;
      border: none;
      font-size: 1rem;
      color: #007bff;
      cursor: pointer;
      padding: 8px 15px;
      border-radius: 4px;
      display: flex;
      align-items: center;
    }
    
    .nav-btn:hover {
      background-color: #f0f7ff;
    }
    
    .calendar-wrapper {
      margin-bottom: 20px;
      overflow: auto;
    }
    
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 5px;
    }
    
    .weekday {
      text-align: center;
      font-weight: 600;
      padding: 10px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
    
    .day {
      border: 1px solid #e9ecef;
      border-radius: 4px;
      min-height: 100px;
      padding: 5px;
    }
    
    .day-header {
      font-weight: 600;
      text-align: center;
      margin-bottom: 5px;
      padding: 5px;
      border-bottom: 1px solid #e9ecef;
    }
    
    .day-content .request-item {
      margin-bottom: 5px;
      padding: 5px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .status-approved {
      background-color: #28a745;
      color: white;
    }
    
    .status-rejected {
      background-color: #dc3545;
      color: white;
    }
    
    .status-chef-approved {
      background-color: #ffc107;
      color: #212529;
    }
    
    .status-pending {
      background-color: #007bff;
      color: white;
    }
    
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
    }
    
    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      margin-right: 8px;
    }
    
    .return-btn {
      background-color: #6c757d;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .return-btn:hover {
      background-color: #5a6268;
    }
  `]
})
export class DirectCalendarComponent implements OnInit {
  weekdays: string[] = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  days: { number: number }[] = [];

  constructor() {}

  ngOnInit(): void {
    // Générer les jours pour le mois de mars 2024
    this.generateDays();
  }

  generateDays(): void {
    // Mars 2024 a 31 jours
    this.days = Array.from({ length: 31 }, (_, i) => ({ number: i + 1 }));
  }
}
