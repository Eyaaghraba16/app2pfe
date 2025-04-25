import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfilesService } from '../../home/profiles-list/profiles.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLogin = true;
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  formError: string = '';

  constructor(
    private router: Router,
    private profilesService: ProfilesService,
    private authService: AuthService
  ) {}

  toggleForm(isLogin: boolean) {
    this.isLogin = isLogin;
    // Reset form fields and error when switching forms
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.email = '';
    this.formError = '';
  }

  onLoginSubmit() {
    this.formError = '';
    
    if (!this.username.trim() || !this.password.trim()) {
      this.formError = 'Veuillez remplir tous les champs';
      return;
    }

    // Connecter l'utilisateur
    this.authService.login();
    console.log('Login submitted', this.username, this.password);
    // Rediriger vers la page d'accueil
    this.router.navigate(['/home/welcome']);
  }

  onRegisterSubmit() {
    this.formError = '';
    
    if (!this.username.trim() || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
      this.formError = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.formError = 'Les mots de passe ne correspondent pas';
      return;
    }

    // Vérifier la force du mot de passe
    if (this.password.length < 8) {
      this.formError = 'Le mot de passe doit contenir au moins 8 caractères';
      return;
    }

    // Add the new profile to the profiles service
    this.profilesService.addProfile({
      username: this.username.trim(),
      email: this.email.trim()
    });

    console.log('Register submitted', this.username, this.email, this.password);
    
    // Connecter l'utilisateur après l'inscription
    this.authService.login();
    // Navigate to the profiles list page to see the new profile
    this.router.navigate(['/home/profiles-list']);
  }
}
