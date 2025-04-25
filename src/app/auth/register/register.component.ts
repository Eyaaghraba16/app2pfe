import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h2>Créer un compte</h2>
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="user.email"
              required
              email
              #email="ngModel"
            >
            <div class="error-message" *ngIf="email.invalid && email.touched">
              Email invalide
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              [type]="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              [(ngModel)]="user.password"
              required
              minlength="6"
              #password="ngModel"
            >
            <div class="error-message" *ngIf="password.invalid && password.touched">
              Le mot de passe doit contenir au moins 6 caractères
            </div>
          </div>

          <div class="show-password">
            <input type="checkbox" id="showPassword" [(ngModel)]="showPassword" name="showPassword">
            <label for="showPassword">Afficher le mot de passe</label>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                [(ngModel)]="user.firstName"
                required
                #firstName="ngModel"
              >
            </div>

            <div class="form-group">
              <label for="lastName">Nom</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                [(ngModel)]="user.lastName"
                required
                #lastName="ngModel"
              >
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid">
            S'inscrire
          </button>

          <div class="login-link">
            Déjà inscrit ? <a (click)="goToLogin()">Se connecter</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      padding: 2rem;
    }

    .register-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 2rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #34495e;
      font-size: 0.9rem;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #3498db;
      }
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    button {
      width: 100%;
      padding: 1rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background: #2980b9;
      }

      &:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
      }
    }

    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #7f8c8d;

      a {
        color: #3498db;
        text-decoration: none;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .show-password {
      margin-bottom: 1.5rem;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  user: Partial<User> = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user'
  };
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.user.email && this.user.password && this.user.firstName && this.user.lastName) {
      const success = this.authService.register(this.user as Omit<User, 'id' | 'personalInfo' | 'professionalInfo'>);
      
      if (success) {
        // Connecter automatiquement l'utilisateur après l'inscription
        this.authService.login(this.user.email, this.user.password);
        this.router.navigate(['/home']);
      } else {
        alert('Cet email est déjà utilisé');
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
