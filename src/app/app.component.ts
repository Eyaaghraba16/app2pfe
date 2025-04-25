import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'Portail RH';
  isLogin: boolean = true;
  isAuthenticated: boolean = false;
  username: string = '';
  password: string = '';
  email: string = '';

  toggleForm(login: boolean) {
    this.isLogin = login;
  }

  onLoginSubmit() {
    // Add your login logic here
    // For now, we'll just set isAuthenticated to true
    this.isAuthenticated = true;
  }

  onRegisterSubmit() {
    // Add your registration logic here
    console.log('Register submitted');
  }
}
