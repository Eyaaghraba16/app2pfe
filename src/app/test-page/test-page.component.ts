import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1 style="color: #3f51b5;">Page de Test</h1>
      <p>Cette page est une page de test très simple.</p>
      <button style="background-color: #3f51b5; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;" routerLink="/login">Retour à la page de connexion</button>
    </div>
  `
})
export class TestPageComponent {
  constructor() {
    console.log('TestPageComponent initialized');
  }
}
