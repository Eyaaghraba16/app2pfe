import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Connexion</h2>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              #emailInput="ngModel"
            >
            <div class="error-message" *ngIf="emailInput.invalid && emailInput.touched">
              Email invalide
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              #passwordInput="ngModel"
            >
            <div class="error-message" *ngIf="passwordInput.invalid && passwordInput.touched">
              Le mot de passe doit contenir au moins 6 caractères
            </div>
          </div>

          <div class="error-message" *ngIf="loginError">
            Email ou mot de passe incorrect
          </div>

          <button type="submit" [disabled]="loginForm.invalid">
            Se connecter
          </button>

          <div class="links">
            <a (click)="goToForgotPassword()">Mot de passe oublié ?</a>
            <a (click)="goToRegister()">Créer un compte</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      padding: 2rem;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 2rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #34495e;
      font-size: 0.9rem;
    }

    input {
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

    .links {
      display: flex;
      justify-content: space-between;
      margin-top: 1.5rem;
      font-size: 0.9rem;

      a {
        color: #3498db;
        text-decoration: none;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.email && this.password) {
      const success = this.authService.login(this.email, this.password);
      
      if (success) {
        this.router.navigate(['/home']);
      } else {
        this.loginError = true;
      }
    }
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
