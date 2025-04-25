import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';

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
    private requestsService: RequestsService
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
      const request = this.requestsService.getRequestById(id);
      if (request && request.details) {
        this.advanceForm.patchValue({
          advanceAmount: request.details.advanceAmount || 0,
          advanceReason: request.details.advanceReason || '',
          attachments: request.details.attachments || null
        });
      }
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
      this.requestsService.addAdvanceRequest(formData);
    }
    this.router.navigate(['/home/requests']);
  }

  onCancel() {
    this.router.navigate(['/home/requests']);
  }
}
