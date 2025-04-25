import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  registeredUsers: User[] = [];
  filteredUsers: User[] = [];
  requests: any[] = []; // Propriété pour stocker les demandes
  editMode: boolean = false;
  editPersonalMode: boolean = false;
  saveSuccess: boolean = false;
  saveError: boolean = false;
  isAdmin: boolean = false;
  selectedUser: User | null = null;

  maritalStatusOptions = [
    { value: 'single', label: 'Célibataire' },
    { value: 'married', label: 'Marié(e)' },
    { value: 'divorced', label: 'Divorcé(e)' },
    { value: 'widowed', label: 'Veuf/Veuve' }
  ];

  contractTypeOptions = [
    { value: 'cdi', label: 'CDI' },
    { value: 'cdd', label: 'CDD' },
    { value: 'internship', label: 'Stage' },
    { value: 'temporary', label: 'Intérim' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
      this.user = this.authService.currentUserValue;
      this.isAdmin = this.user?.role === 'admin';
      
      if (this.isAdmin) {
          this.registeredUsers = this.authService.getAllNonAdminUsers();
          this.filteredUsers = [...this.registeredUsers];
          this.requests = this.authService.getAllRequests();
          console.log('Demandes récupérées:', this.requests);
      }
  }

  selectUser(user: User) {
    if (this.isAdmin) {
      this.selectedUser = user;
      this.editMode = true; // Enable edit mode when a user is selected
    }
  }

  clearSelectedUser() {
    this.selectedUser = null;
    this.editMode = false;
    this.editPersonalMode = false;
  }

  canEdit(): boolean {
    return this.isAdmin;
  }

  onImageChange(event: any) {
    if (!this.canEdit()) return;

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        const targetUser = this.selectedUser || this.user;
        if (targetUser) {
          targetUser.profileImage = e.target.result;
          this.authService.updateUserProfile(targetUser.id, { profileImage: targetUser.profileImage });
        }
      };

      reader.readAsDataURL(file);
    }
  }

  deleteProfileImage() {
    if (!this.canEdit()) return;
    
    const targetUser = this.selectedUser || this.user;
    if (targetUser) {
      targetUser.profileImage = '';
      this.authService.updateUserProfile(targetUser.id, { profileImage: '' });
    }
  }

  toggleEditMode() {
    if (!this.canEdit()) return;
    this.editMode = !this.editMode; // Toggle edit mode
  }

  toggleEditPersonalMode() {
    if (!this.canEdit()) return;
    this.editPersonalMode = !this.editPersonalMode;
  }

  saveProfile() {
    if (!this.canEdit()) return;
    
    const targetUser = this.selectedUser || this.user;
    if (targetUser) {
      const success = this.authService.updateUserProfile(targetUser.id, targetUser);
      if (success) {
        this.saveSuccess = true;
        this.saveError = false;
        this.editMode = false; // Disable edit mode after saving
        setTimeout(() => {
          this.saveSuccess = false;
        }, 3000);
      } else {
        this.saveError = true;
        this.saveSuccess = false;
      }
    }
  }

  savePersonalInfo() {
    if (!this.canEdit()) return;
    
    const targetUser = this.selectedUser || this.user;
    if (targetUser) {
      const success = this.authService.updateUserProfile(targetUser.id, {
        personalInfo: targetUser.personalInfo
      });
      if (success) {
        this.saveSuccess = true;
        this.saveError = false;
        this.editPersonalMode = false;
        setTimeout(() => {
          this.saveSuccess = false;
        }, 3000);
      } else {
        this.saveError = true;
        this.saveSuccess = false;
      }
    }
  }

  cancelEdit() {
    const targetUser = this.selectedUser || this.user;
    if (targetUser) {
      const updatedUser = this.authService.getUserById(targetUser.id);
      if (updatedUser) {
        if (this.selectedUser) {
          this.selectedUser = updatedUser;
        } else {
          this.user = updatedUser;
        }
      }
    }
    this.editMode = false;
    this.saveError = false;
    this.saveSuccess = false;
  }

  cancelPersonalEdit() {
    const targetUser = this.selectedUser || this.user;
    if (targetUser) {
      const updatedUser = this.authService.getUserById(targetUser.id);
      if (updatedUser) {
        if (this.selectedUser) {
          this.selectedUser = updatedUser;
        } else {
          this.user = updatedUser;
        }
      }
    }
    this.editPersonalMode = false;
    this.saveError = false;
    this.saveSuccess = false;
  }

  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  changePassword() {
    // Cette fonctionnalité sera implémentée plus tard
    console.log('Changing password...');
  }

  onSearch(searchTerm: string) {
    if (!searchTerm) {
      this.filteredUsers = [...this.registeredUsers];
      return;
    }
    const term = searchTerm.toLowerCase();
    this.filteredUsers = this.registeredUsers.filter(user =>
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  }
}