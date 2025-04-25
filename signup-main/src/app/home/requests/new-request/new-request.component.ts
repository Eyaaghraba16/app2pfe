import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-request',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="new-request-container">
      <div class="header">
        <h2>Nouvelle Demande</h2>
        <p>Sélectionnez le type de demande que vous souhaitez créer</p>
      </div>

      <div class="request-types">
        <div class="request-type-card" (click)="selectRequestType('Congé annuel')">
          <div class="icon">
            <i class='bx bx-calendar'></i>
          </div>
          <h3>Congé annuel</h3>
          <p>Demandez des jours de congé pour vos vacances ou repos</p>
        </div>

        <div class="request-type-card" (click)="selectRequestType('Formation')">
          <div class="icon">
            <i class='bx bx-graduation'></i>
          </div>
          <h3>Formation</h3>
          <p>Demandez une formation professionnelle</p>
        </div>

        <div class="request-type-card" (click)="selectRequestType('Attestation de travail')">
          <div class="icon">
            <i class='bx bx-file'></i>
          </div>
          <h3>Attestation de travail</h3>
          <p>Demandez une attestation de travail</p>
        </div>
      </div>

      <div class="actions">
        <button class="btn-back" (click)="goBack()">
          <i class='bx bx-arrow-back'></i>
          Retour
        </button>
      </div>
    </div>
  `,
  styles: [`
    .new-request-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;

      h2 {
        color: #333;
        margin-bottom: 10px;
      }

      p {
        color: #666;
      }
    }

    .request-types {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .request-type-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      }

      .icon {
        width: 60px;
        height: 60px;
        background: #f8f9fa;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;

        i {
          font-size: 30px;
          color: #007bff;
        }
      }

      h3 {
        color: #333;
        margin-bottom: 10px;
      }

      p {
        color: #666;
        font-size: 14px;
        line-height: 1.5;
      }
    }

    .actions {
      display: flex;
      justify-content: center;

      .btn-back {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
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
    }
  `]
})
export class NewRequestComponent {
  constructor(private router: Router) {}

  selectRequestType(type: string) {
    switch (type) {
      case 'Congé annuel':
        this.router.navigate(['/home/requests/leave']);
        break;
      case 'Formation':
        this.router.navigate(['/home/requests/training']);
        break;
      case 'Attestation de travail':
        this.router.navigate(['/home/requests/certificate']);
        break;
    }
  }

  goBack() {
    this.router.navigate(['/home/requests']);
  }
}
