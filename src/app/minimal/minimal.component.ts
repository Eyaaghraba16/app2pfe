import { Component } from '@angular/core';

@Component({
  selector: 'app-minimal',
  standalone: true,
  imports: [],
  template: '<div style="padding: 20px;"><h1>Page Minimale</h1><p>Ceci est une page de test minimale.</p></div>'
})
export class MinimalComponent {
  constructor() {
    console.log('MinimalComponent initialized');
  }
}
