import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordResetService } from '../password-reset.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="forgot-password-container">
      <div class="form-box">
        <h2>Réinitialisation du mot de passe</h2>
        <p class="instruction">Entrez votre adresse e-mail pour réinitialiser votre mot de passe</p>
        
        <form (ngSubmit)="onSubmit()">
          <div class="input-box">
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              placeholder="Adresse e-mail"
              required>
            <i class='bx bxs-envelope'></i>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <button type="submit" class="btn" [disabled]="isLoading">
            <span *ngIf="!isLoading">Réinitialiser le mot de passe</span>
            <span *ngIf="isLoading">Envoi en cours...</span>
          </button>
          
          <p class="back-to-login">
            <a (click)="backToLogin()">Retour à la connexion</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
      padding: 20px;
    }

    .form-box {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 20px;
    }

    .instruction {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
    }

    .input-box {
      position: relative;
      margin-bottom: 20px;
    }

    .input-box input {
      width: 100%;
      padding: 15px 45px 15px 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }

    .input-box input:focus {
      border-color: #007bff;
      outline: none;
    }

    .input-box i {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }

    .error-message {
      color: #dc3545;
      text-align: center;
      margin-bottom: 15px;
    }

    .success-message {
      color: #28a745;
      text-align: center;
      margin-bottom: 15px;
    }

    .btn {
      width: 100%;
      padding: 15px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .btn:not(:disabled):hover {
      background: #0056b3;
    }

    .btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .back-to-login {
      text-align: center;
      margin-top: 20px;
    }

    .back-to-login a {
      color: #007bff;
      text-decoration: none;
      cursor: pointer;
    }

    .back-to-login a:hover {
      text-decoration: underline;
    }
  `]
})
export class ForgotPasswordComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private passwordResetService: PasswordResetService
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email) {
      this.errorMessage = 'Veuillez entrer votre adresse e-mail';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Veuillez entrer une adresse e-mail valide';
      return;
    }

    this.isLoading = true;

    // Générer un token de réinitialisation
    const resetToken = this.passwordResetService.generateResetToken(this.email);

    if (!resetToken) {
      this.errorMessage = 'Aucun compte n\'est associé à cette adresse e-mail';
      this.isLoading = false;
      return;
    }

    // Envoyer l'email de réinitialisation
    this.passwordResetService.sendResetEmail(this.email, resetToken);
    
    this.successMessage = 'Un e-mail de réinitialisation a été envoyé à ' + this.email;
    
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/login']);
    }, 3000);
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
