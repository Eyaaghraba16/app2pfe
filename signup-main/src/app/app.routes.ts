import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RequestsComponent } from './home/requests/requests.component';
import { ProfileComponent } from './home/profile/profile.component';
import { LoginComponent } from './auth/login/login.component';
import { ProfilesListComponent } from './home/profiles-list/profiles-list.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { NewRequestComponent } from './home/requests/new-request/new-request.component';
import { LeaveRequestComponent } from './home/requests/leave-request/leave-request.component';
import { TrainingRequestComponent } from './home/requests/training-request/training-request.component';
import { WorkCertificateRequestComponent } from './home/requests/work-certificate-request/work-certificate-request.component';
import { RequestDetailsComponent } from './home/requests/request-details/request-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { 
    path: 'home', 
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: 'welcome', component: WelcomeComponent },
      { path: 'requests', component: RequestsComponent },
      { path: 'requests/new', component: NewRequestComponent },
      { path: 'requests/leave', component: LeaveRequestComponent },
      { path: 'requests/leave/edit/:id', component: LeaveRequestComponent },
      { path: 'requests/training', component: TrainingRequestComponent },
      { path: 'requests/training/edit/:id', component: TrainingRequestComponent },
      { path: 'requests/certificate', component: WorkCertificateRequestComponent },
      { path: 'requests/certificate/edit/:id', component: WorkCertificateRequestComponent },
      { path: 'requests/:id', component: RequestDetailsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profiles-list', component: ProfilesListComponent }
    ]
  }
];
