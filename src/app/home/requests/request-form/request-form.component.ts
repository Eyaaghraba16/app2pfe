import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../../../services/request.service';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Request } from '../../../models/request.model';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent implements OnInit {
  requestForm: FormGroup;
  loading = false;

  requestTypes = [
    { value: 'congé annuel', label: 'Congé annuel', icon: 'fa-calendar-alt' },
    { value: 'congé maladie', label: 'Congé maladie', icon: 'fa-hospital' },
    { value: 'congé exceptionnel', label: 'Congé exceptionnel', icon: 'fa-exclamation-circle' },
    { value: 'formation', label: 'Formation', icon: 'fa-graduation-cap' },
    { value: 'autre', label: 'Autre', icon: 'fa-file-alt' }
  ];

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.requestForm = this.fb.group({
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.loading = true;
      const userId = this.authService.getCurrentUserId();
      
      if (!userId) {
        this.snackBar.open('Erreur: Utilisateur non connecté', 'Fermer', {
          duration: 3000
        });
        return;
      }

      const request: Partial<Request> = {
        user_id: userId,
        type: this.requestForm.value.type,
        start_date: this.requestForm.value.startDate,
        end_date: this.requestForm.value.endDate,
        description: this.requestForm.value.description,
        status: 'en attente' as const
      };

      this.requestService.createRequest(request).subscribe({
        next: () => {
          this.snackBar.open('Demande envoyée avec succès', 'Fermer', {
            duration: 3000
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi de la demande:', error);
          this.snackBar.open('Erreur lors de l\'envoi de la demande', 'Fermer', {
            duration: 3000
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
