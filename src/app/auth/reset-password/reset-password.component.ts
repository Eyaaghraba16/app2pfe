import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetService } from '../password-reset.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reset-password-container">
      <div class="form-box">
        <h2>Nouveau mot de passe</h2>
        <p class="instruction">Veuillez entrer votre nouveau mot de passe</p>
        
        <form (ngSubmit)="onSubmit()" *ngIf="!tokenInvalid">
          <div class="input-box">
            <input 
              [type]="showPassword ? 'text' : 'password'"
              [(ngModel)]="password" 
              name="password" 
              placeholder="Nouveau mot de passe"
              required>
            <i class='bx bxs-lock'></i>
          </div>

          <div class="input-box">
            <input 
              [type]="showPassword ? 'text' : 'password'"
              [(ngModel)]="confirmPassword" 
              name="confirmPassword" 
              placeholder="Confirmer le mot de passe"
              required>
            <i class='bx bxs-lock'></i>
          </div>

          <div class="show-password">
            <input type="checkbox" id="showPassword" [(ngModel)]="showPassword" name="showPassword">
            <label for="showPassword">Afficher le mot de passe</label>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <button type="submit" class="btn" [disabled]="isLoading">
            <span *ngIf="!isLoading">Réinitialiser le mot de passe</span>
            <span *ngIf="isLoading">Réinitialisation en cours...</span>
          </button>
        </form>

        <div class="error-box" *ngIf="tokenInvalid">
          <i class='bx bx-error-circle'></i>
          <h3>Lien invalide ou expiré</h3>
          <p>Le lien de réinitialisation du mot de passe est invalide ou a expiré.</p>
          <button class="btn" (click)="backToForgotPassword()">Demander un nouveau lien</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-password-container {
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

    .error-box {
      text-align: center;
      color: #dc3545;

      i {
        font-size: 48px;
        margin-bottom: 15px;
      }

      h3 {
        margin-bottom: 10px;
      }

      p {
        margin-bottom: 20px;
        color: #666;
      }
    }

    .show-password {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      
      input[type="checkbox"] {
        width: auto;
        margin: 0;
      }
      
      label {
        color: #666;
        font-size: 14px;
        cursor: pointer;
      }
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  tokenInvalid: boolean = false;
  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private passwordResetService: PasswordResetService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    
    if (!this.token || !this.passwordResetService.validateResetToken(this.token)) {
      this.tokenInvalid = true;
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.password || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.isLoading = true;

    if (this.passwordResetService.resetPassword(this.token, this.password)) {
      this.successMessage = 'Votre mot de passe a été réinitialisé avec succès';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.errorMessage = 'Une erreur est survenue lors de la réinitialisation du mot de passe';
    }

    this.isLoading = false;
  }

  backToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
