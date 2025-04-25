import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RequestsComponent } from './home/requests/requests.component';
import { ProfileComponent } from './home/profile/profile.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { NewRequestComponent } from './home/requests/new-request/new-request.component';
import { LeaveRequestComponent } from './home/requests/leave-request/leave-request.component';
import { TrainingRequestComponent } from './home/requests/training-request/training-request.component';
import { WorkCertificateRequestComponent } from './home/requests/work-certificate-request/work-certificate-request.component';
import { RequestDetailsComponent } from './home/requests/request-details/request-details.component';
import { LoanRequestComponent } from './home/requests/loan-request/loan-request.component';
import { AdvanceRequestComponent } from './home/requests/advance-request/advance-request.component';
import { DocumentRequestComponent } from './home/requests/document-request/document-request.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard],
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
      { path: 'requests/loan', component: LoanRequestComponent },
      { path: 'requests/loan/edit/:id', component: LoanRequestComponent },
      { path: 'requests/advance', component: AdvanceRequestComponent },
      { path: 'requests/advance/edit/:id', component: AdvanceRequestComponent },
      { path: 'requests/document', component: DocumentRequestComponent },
      { path: 'requests/document/edit/:id', component: DocumentRequestComponent },
      { path: 'requests/:id', component: RequestDetailsComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];
