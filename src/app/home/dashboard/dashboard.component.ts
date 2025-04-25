import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsService } from '../requests/requests.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  recentRequests: any[] = [];
  currentUser: any;

  constructor(
    private requestsService: RequestsService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit() {
    this.requestsService.getRequests().subscribe(requests => {
      // Get the 5 most recent requests for the current user
      this.recentRequests = requests
        .filter(req => req.userId === this.currentUser.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    });
  }
}
