import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesService } from './profiles.service';

@Component({
  selector: 'app-profiles-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profiles-container">
      <h2>Liste des Profils</h2>
      <div class="profiles-grid">
        <div class="profile-card" *ngFor="let profile of profiles">
          <img src="assets/profile-placeholder.png" alt="Profile" class="profile-img">
          <div class="profile-info">
            <h3>{{ profile.username }}</h3>
            <p>{{ profile.email }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profiles-container {
      padding: 20px;
    }
    
    h2 {
      color: #333;
      margin-bottom: 20px;
    }
    
    .profiles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .profile-card {
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .profile-img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .profile-info {
      flex: 1;
    }
    
    .profile-info h3 {
      margin: 0;
      color: #333;
    }
    
    .profile-info p {
      margin: 5px 0 0;
      color: #666;
    }
  `]
})
export class ProfilesListComponent implements OnInit {
  profiles: any[] = [];

  constructor(private profilesService: ProfilesService) {}

  ngOnInit() {
    this.profiles = this.profilesService.getProfiles();
  }
}
