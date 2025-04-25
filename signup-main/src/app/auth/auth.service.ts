import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor(private router: Router) {}

  login() {
    this.isAuthenticated = true;
    // Stocker l'état de connexion dans localStorage
    localStorage.setItem('isLoggedIn', 'true');
  }

  logout() {
    this.isAuthenticated = false;
    // Supprimer l'état de connexion de localStorage
    localStorage.removeItem('isLoggedIn');
    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated || localStorage.getItem('isLoggedIn') === 'true';
  }
}
