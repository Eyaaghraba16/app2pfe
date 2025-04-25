import { Injectable } from '@angular/core';

export interface Profile {
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  private profiles: Profile[] = [];

  constructor() {
    // Load profiles from localStorage when service is created
    const savedProfiles = localStorage.getItem('profiles');
    if (savedProfiles) {
      this.profiles = JSON.parse(savedProfiles);
    }
  }

  addProfile(profile: Profile) {
    this.profiles.push(profile);
    // Save to localStorage
    localStorage.setItem('profiles', JSON.stringify(this.profiles));
  }

  getProfiles(): Profile[] {
    return this.profiles;
  }
}
