import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userProfile = {
    name: 'Eya Ghraba',
    email: 'gheya63@example.com',
    phone: '+216 XX XXX XXX',
    department: 'Ressources Humaines',
    position: 'Responsable RH',
    birthDate: '1990-01-01',
    hireDate: '2020-01-01',
    employeeId: 'EMP001',
    image: ''
  };

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userProfile.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    console.log('Saving profile...', this.userProfile);
    // Implement save logic here
  }

  changePassword() {
    console.log('Changing password...');
    // Implement password change logic here
  }
}
