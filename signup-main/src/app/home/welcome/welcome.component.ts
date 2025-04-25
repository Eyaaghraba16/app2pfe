import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="welcome-container">
      <div class="welcome-content">
        <div class="logo">
          <img src="assets/arab-soft-logo.png" alt="Arab Soft Logo">
        </div>
        <h1>Bienvenue sur la plateforme Arab Soft</h1>
        <p>Nous sommes ravis de vous accueillir. Utilisez la barre de navigation pour accéder à vos demandes, votre profil ou consulter la liste des profils.</p>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }

    .welcome-content {
      text-align: center;
      max-width: 800px;
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .logo {
      margin-bottom: 30px;
    }

    .logo img {
      max-width: 300px;
      height: auto;
    }

    h1 {
      color: #333;
      margin-bottom: 20px;
      font-size: 2.5em;
    }

    p {
      color: #666;
      font-size: 1.2em;
      line-height: 1.6;
      margin-bottom: 0;
    }
  `]
})
export class WelcomeComponent {}
