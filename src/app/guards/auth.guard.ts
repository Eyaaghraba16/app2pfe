import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check for admin route
    if (route.data['roles'] && route.data['roles'].includes('admin')) {
      if (currentUser.email !== 'admin@company.com') {
        this.router.navigate(['/home']);
        return false;
      }
    }

    return true;
  }
}
