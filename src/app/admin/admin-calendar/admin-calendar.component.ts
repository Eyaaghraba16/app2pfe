import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Request {
  id: string;
  userId: string;
  type: string;
  requestType: string;
  date: string;
  status: string;
  description: string;
  details: any;
  user?: {
    id: string;
    name: string;
    firstname: string;
    lastname: string;
    role: string;
  };
  createdAt?: Date;
}

@Component({
  selector: 'app-admin-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-calendar-container">
      <h1>Calendrier des Demandes</h1>
      <div class="calendar-navigation">
        <button (click)="previousMonth()">&lt; Mois précédent</button>
        <h2>{{ months[currentMonth.getMonth()] }} {{ currentMonth.getFullYear() }}</h2>
        <button (click)="nextMonth()">Mois suivant &gt;</button>
      </div>
      
      <div class="calendar">
        <div class="weekdays">
          <div *ngFor="let day of weekdays" class="weekday">{{ day }}</div>
        </div>
        <div class="days">
          <div *ngFor="let day of calendarDays" class="day" [class.empty]="day.number === 0">
            <div *ngIf="day.number !== 0" class="day-number">{{ day.number }}</div>
            <div *ngIf="day.number !== 0 && day.requests.length > 0" class="day-requests">
              <div *ngFor="let request of day.requests" 
                   class="request-item" 
                   [class]="getStatusClass(request.status)">
                {{ request.type }} - {{ request.user?.firstname }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="calendar-legend">
        <div class="legend-item">
          <div class="legend-color status-approved"></div>
          <div>Approuvée</div>
        </div>
        <div class="legend-item">
          <div class="legend-color status-rejected"></div>
          <div>Rejetée</div>
        </div>
        <div class="legend-item">
          <div class="legend-color status-chef-approved"></div>
          <div>Approuvée par le chef</div>
        </div>
        <div class="legend-item">
          <div class="legend-color status-pending"></div>
          <div>En attente</div>
        </div>
      </div>
      
      <div class="navigation-buttons">
        <button routerLink="/home">Retour à l'accueil</button>
      </div>
    </div>
  `,
  styles: [`
    .admin-calendar-container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    .calendar-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .calendar-navigation button {
      background-color: #3f51b5;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .calendar {
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background-color: #f5f5f5;
      border-bottom: 1px solid #ddd;
    }
    
    .weekday {
      padding: 10px;
      text-align: center;
      font-weight: bold;
    }
    
    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-auto-rows: minmax(100px, auto);
    }
    
    .day {
      border: 1px solid #ddd;
      padding: 5px;
      min-height: 100px;
    }
    
    .empty {
      background-color: #f9f9f9;
    }
    
    .day-number {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .day-requests {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .request-item {
      padding: 3px 5px;
      border-radius: 3px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .status-approved {
      background-color: #4CAF50;
      color: white;
    }
    
    .status-rejected {
      background-color: #F44336;
      color: white;
    }
    
    .status-chef-approved {
      background-color: #FFC107;
    }
    
    .status-pending {
      background-color: #2196F3;
      color: white;
    }
    
    .calendar-legend {
      display: flex;
      gap: 20px;
      margin-top: 20px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 3px;
    }
    
    .navigation-buttons {
      margin-top: 20px;
    }
    
    .navigation-buttons button {
      background-color: #3f51b5;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class AdminCalendarComponent implements OnInit {
  currentMonth: Date = new Date();
  calendarDays: { number: number, requests: Request[] }[] = [];
  weekdays: string[] = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  months: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  
  // Données de test pour les demandes
  requests: Request[] = [
    {
      id: '1',
      userId: 'user1',
      type: 'Congé annuel',
      requestType: 'congé annuel',
      date: new Date().toISOString(),
      status: 'APPROVED',
      description: 'Demande de congé annuel',
      details: {},
      createdAt: new Date(),
      user: {
        id: '1',
        name: 'John Doe',
        firstname: 'John',
        lastname: 'Doe',
        role: 'user'
      }
    },
    {
      id: '2',
      userId: 'user2',
      type: 'Document',
      requestType: 'document',
      date: new Date().toISOString(),
      status: 'PENDING',
      description: 'Demande de document',
      details: {},
      createdAt: new Date(new Date().setDate(new Date().getDate() + 2)),
      user: {
        id: '2',
        name: 'Jane Smith',
        firstname: 'Jane',
        lastname: 'Smith',
        role: 'user'
      }
    },
    {
      id: '3',
      userId: 'user1',
      type: 'Formation',
      requestType: 'formation',
      date: new Date().toISOString(),
      status: 'CHEF_APPROVED',
      description: 'Demande de formation',
      details: {},
      createdAt: new Date(new Date().setDate(new Date().getDate() + 5)),
      user: {
        id: '1',
        name: 'John Doe',
        firstname: 'John',
        lastname: 'Doe',
        role: 'user'
      }
    },
    {
      id: '4',
      userId: 'user3',
      type: 'Prêt',
      requestType: 'prêt',
      date: new Date().toISOString(),
      status: 'REJECTED',
      description: 'Demande de prêt',
      details: {},
      createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
      user: {
        id: '3',
        name: 'Bob Johnson',
        firstname: 'Bob',
        lastname: 'Johnson',
        role: 'user'
      }
    }
  ];

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Premier jour du mois (0 = dimanche, 1 = lundi, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    
    // Nombre de jours dans le mois
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Initialiser le tableau des jours
    this.calendarDays = [];
    
    // Ajouter les cases vides pour les jours avant le premier jour du mois
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push({ number: 0, requests: [] });
    }
    
    // Ajouter les jours du mois avec leurs demandes
    for (let i = 1; i <= daysInMonth; i++) {
      const dayRequests = this.getRequestsForDay(i);
      this.calendarDays.push({ number: i, requests: dayRequests });
    }
    
    // Compléter la dernière semaine avec des cases vides si nécessaire
    const remainingCells = 42 - this.calendarDays.length; // 6 semaines * 7 jours = 42
    for (let i = 0; i < remainingCells; i++) {
      this.calendarDays.push({ number: 0, requests: [] });
    }
  }
  
  getRequestsForDay(day: number): Request[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const dayStart = new Date(year, month, day);
    const dayEnd = new Date(year, month, day, 23, 59, 59, 999);
    
    return this.requests.filter(request => {
      if (!request.createdAt) return false;
      
      const requestDate = new Date(request.createdAt);
      return requestDate >= dayStart && requestDate <= dayEnd;
    });
  }
  
  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }
  
  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }
  
  getStatusClass(status: string): string {
    if (status === 'APPROVED' || status === 'admin_approved') {
      return 'status-approved';
    } else if (status === 'REJECTED' || status === 'admin_rejected' || status === 'chef_rejected') {
      return 'status-rejected';
    } else if (status === 'CHEF_APPROVED' || status === 'chef_approved') {
      return 'status-chef-approved';
    }
    return 'status-pending';
  }
}
