import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestService } from '../../services/request.service';
import { Request } from '../../models/request.model';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.scss']
})
export class EditRequestComponent implements OnInit {
  requestForm: FormGroup;
  requestId: string = '';
  loading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private snackBar: MatSnackBar
  ) {
    this.requestForm = this.fb.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.requestId = this.route.snapshot.params['id'];
    this.loadRequest();
  }

  loadRequest(): void {
    this.requestService.getRequest(this.requestId).subscribe({
      next: (request) => {
        this.requestForm.patchValue({
          start_date: request.start_date,
          end_date: request.end_date,
          description: request.description,
          type: request.type
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la demande:', error);
        this.snackBar.open('Erreur lors du chargement de la demande', 'Fermer', {
          duration: 3000
        });
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      const updatedRequest = {
        ...this.requestForm.value,
        id: this.requestId
      };

      this.requestService.updateRequest(updatedRequest).subscribe({
        next: () => {
          this.snackBar.open('Demande mise à jour avec succès', 'Fermer', {
            duration: 3000
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la demande:', error);
          this.snackBar.open('Erreur lors de la mise à jour de la demande', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }
}
