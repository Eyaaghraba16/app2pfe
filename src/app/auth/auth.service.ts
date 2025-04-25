import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, PersonalInfo, ProfessionalInfo } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private users: User[] = [];
  private requests: any[] = []; // Ajout d'un tableau pour stocker les demandes

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    // Load users from localStorage only in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const storedUsers = localStorage.getItem('users');
      this.users = storedUsers ? JSON.parse(storedUsers) : [];
    } else {
      this.users = [];
    }

    // Create default admin account if it doesn't exist
    const adminExists = this.users.some(user => user.email === 'admin@company.com');
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@company.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'RH',
        role: 'admin',
        profileImage: '',
        personalInfo: {
          dateOfBirth: new Date('1990-01-01').toISOString(),
          placeOfBirth: 'Paris',
          nationality: 'Française',
          address: '1 Rue de l\'Administration',
          phoneNumber: '0600000000',
          maritalStatus: 'single',
          cin: 'AB123456',
          numberOfChildren: 0,
          city: 'Paris',
          country: 'France',
          emergencyContact: {
            name: 'Contact Urgence',
            relationship: 'Famille',
            phoneNumber: '0600000001'
          }
        },
        professionalInfo: {
          employeeId: 'ADM001',
          department: 'Ressources Humaines',
          position: 'Responsable RH',
          joinDate: new Date('2024-01-01').toISOString(),
          contractType: 'CDI',
          salary: 50000,
          grade: 'Cadre',
          rib: 'FR7630001007941234567890185',
          bankName: 'Banque Nationale',
          cnss: 'CNSS123456',
          mutuelle: 'MUT789012'
        }
      };
      this.users.push(adminUser);
      this.saveUsers();
    }

    // Create default chef account if it doesn't exist
    const chefExists = this.users.some(user => user.email === 'chef@aya.com');
    if (!chefExists) {
      const chefUser: User = {
        id: 'chef-1',
        email: 'chef@aya.com',
        password: 'Chef123!',
        firstName: 'Chef',
        lastName: 'Equipe',
        role: 'chef',
        profileImage: '',
        personalInfo: {
          dateOfBirth: new Date('1985-01-01').toISOString(),
          placeOfBirth: 'Casablanca',
          nationality: 'Marocaine',
          address: '123 Rue des Chefs',
          phoneNumber: '0600000000',
          maritalStatus: 'married',
          cin: 'CD789012',
          numberOfChildren: 2,
          city: 'Casablanca',
          country: 'Maroc',
          emergencyContact: {
            name: 'Contact Urgence',
            relationship: 'Famille',
            phoneNumber: '0600000001'
          }
        },
        professionalInfo: {
          employeeId: 'CHEF001',
          department: 'Management',
          position: 'Chef d\'équipe',
          joinDate: new Date('2020-01-01').toISOString(),
          contractType: 'CDI',
          salary: 35000,
          grade: 'Senior',
          rib: 'FR7630001007941234567890186',
          bankName: 'Banque Nationale',
          cnss: 'CNSS789012',
          mutuelle: 'MUT123456'
        }
      };
      this.users.push(chefUser);
      this.saveUsers();
    }

    // Load current user from localStorage only in browser environment
    let currentUser = null;
    if (isPlatformBrowser(this.platformId)) {
      currentUser = localStorage.getItem('currentUser');
    }
    this.currentUserSubject = new BehaviorSubject<User | null>(
      currentUser ? JSON.parse(currentUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private saveUsers() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getAllNonAdminUsers(): User[] {
    return this.users.filter(user => user.role !== 'admin');
  }

  getAllRequests(): any[] {
    return this.requests; // Retourne toutes les demandes
  }

  submitRequest(userId: string, requestType: string): void {
      const newRequest = {
          id: this.generateUniqueId(),
          userId,
          requestType,
          status: 'pending',
          createdAt: new Date(),
      };
      console.log('Nouvelle demande soumise:', newRequest); // Ajoutez ce log
      this.requests.push(newRequest);
      this.saveRequests();
  }

  private saveRequests() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('requests', JSON.stringify(this.requests)); // Sauvegarde des demandes
    }
  }

  register(user: Omit<User, 'id' | 'personalInfo' | 'professionalInfo'>): boolean {
    // Check if email already exists
    if (this.users.some(u => u.email === user.email)) {
      return false;
    }

    // Create default personal info
    const personalInfo: PersonalInfo = {
      cin: '',
      dateOfBirth: '',
      placeOfBirth: '',
      nationality: 'Tunisienne',
      maritalStatus: 'single',
      numberOfChildren: 0,
      address: '',
      city: '',
      country: 'Tunisie',
      phoneNumber: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phoneNumber: ''
      }
    };

    // Create default professional info
    const professionalInfo: ProfessionalInfo = {
      employeeId: `EMP${Date.now().toString().slice(-6)}`,
      department: '',
      position: '',
      grade: '',
      joinDate: new Date().toISOString(),
      contractType: 'CDI',
      salary: 0,
      rib: '',
      bankName: '',
      cnss: '',
      mutuelle: ''
    };

    // Create new user with unique ID
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      personalInfo,
      professionalInfo,
      profileImage: '',
      role: 'user' // Default role for new users
    };

    // Add user to list
    this.users.push(newUser);
    this.saveUsers();

    return true;
  }

  login(email: string, password: string): boolean {
    // Find user
    const user = this.users.find(u => u.email === email && u.password === password);

    if (user) {
      // Don't store password in localStorage
      const { password: _, ...userWithoutPassword } = user;
      
      // Store user in localStorage only in browser environment
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        localStorage.setItem('isLoggedIn', 'true');
      }
      
      // Update BehaviorSubject
      this.currentUserSubject.next(userWithoutPassword);

      // Navigate based on user role
      if (email === 'admin@company.com') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/home']);
      }
      
      return true;
    }

    return false;
  }

  logout() {
    // Remove user from localStorage only in browser environment
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
    }
    
    // Update BehaviorSubject
    this.currentUserSubject.next(null);
    
    // Navigate to login
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUserValue !== null;
  }

  updateUserProfile(userId: string, updates: Partial<User>): boolean {
    const userIndex = this.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return false;
    }

    // Update user
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    this.saveUsers();

    // If it's the current user, update currentUser as well
    if (this.currentUserValue?.id === userId) {
      const updatedUser = { ...this.currentUserValue, ...updates };
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      this.currentUserSubject.next(updatedUser);
    }

    return true;
  }

  getUserById(userId: string): User | null {
    return this.users.find(u => u.id === userId) || null;
  }

  private generateUniqueId(): string {
    return 'id-' + Math.random().toString(36).substr(2, 9); // Simple unique ID generator
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserValue;
    return currentUser?.role === 'admin';
  }

  isChef(): boolean {
    const currentUser = this.currentUserValue;
    return currentUser?.role === 'chef';
  }
}