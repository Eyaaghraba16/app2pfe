import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';

import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-advance-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advance-request.component.html',
  styleUrls: ['./advance-request.component.scss']
})
export class AdvanceRequestComponent implements OnInit {
  requestId: string | null = null;
  editMode = false;
  advanceForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService,
    private authService: AuthService
  ) {
    this.advanceForm = new FormGroup({
      advanceAmount: new FormControl(0, [
        Validators.required, 
        Validators.min(0),
        Validators.max(2000)
      ]),
      advanceReason: new FormControl('', [Validators.required]),
      attachments: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestId = id;
      this.editMode = true;
      this.requestsService.getRequestById(id).subscribe(request => {
        if (request && request.details) {
          this.advanceForm.patchValue({
            advanceAmount: request.details.advanceAmount || 0,
            advanceReason: request.details.advanceReason || '',
            attachments: request.details.attachments || null
          });
        }
      });
    }
  }

  onSubmit() {
    if (!this.advanceForm.valid) {
      return;
    }

    const formData = new FormData();
    const formValues = this.advanceForm.value;
    
    formData.append('advanceAmount', formValues.advanceAmount);
    formData.append('advanceReason', formValues.advanceReason);
    
    const files = formValues.attachments;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('attachments', files[i]);
      }
    }
    
    if (this.requestId) {
      this.requestsService.updateAdvanceRequest(this.requestId, formData);
    } else {
      // Construction de l'objet Request pour addRequest
      const currentUser = this.authService.currentUserValue;
      const newRequest = {
        requestType: 'advance',
        id: Math.random().toString(36).substr(2, 9),
        type: "Avance sur salaire",
        date: new Date().toISOString(),
        status: 'En attente',
        userId: currentUser?.id || '',
        details: {
          amount: String(formValues.advanceAmount),
          reason: formValues.advanceReason,
          documents: formValues.attachments as any
        },
        description: `Demande d'avance sur salaire - ${formValues.advanceAmount} DT`,
        createdAt: new Date().toISOString(),
        user: currentUser
      };
      this.requestsService.addRequest(newRequest);
    }
    this.router.navigate(['/home/requests']);
  }

  onCancel() {
    this.router.navigate(['/home/requests']);
  }
}
