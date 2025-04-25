import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-basic-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 20px; text-align: center;">
      <h1>Administration de Base</h1>
      <p>Ceci est une page d'administration très simple pour tester l'affichage.</p>
      <button routerLink="/home">Retour à l'accueil</button>
    </div>
  `,
  styles: [`
    h1 { color: #3f51b5; }
    button { 
      background-color: #3f51b5; 
      color: white; 
      border: none; 
      padding: 10px 20px; 
      border-radius: 4px; 
      cursor: pointer; 
    }
  `]
})
export class BasicAdminComponent {
  constructor() {
    console.log('BasicAdminComponent initialized');
  }
}
