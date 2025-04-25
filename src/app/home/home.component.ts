import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user.model';
import { NotificationsComponent } from '../shared/notifications/notifications.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Get current user
    this.currentUser = this.authService.currentUserValue;
    
    // Subscribe to user changes
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  // Fonction de test pour les notifications
  testNotification() {
    this.notificationService.addNotification({
      id: Date.now().toString(),
      message: `Nouvelle notification de test`,
      type: 'info',
      timestamp: new Date(),
      read: false,
      link: `/home/requests`
    });
  }
}
