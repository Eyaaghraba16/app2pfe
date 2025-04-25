import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-document-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './document-request.component.html',
  styleUrls: ['./document-request.component.scss']
})
export class DocumentRequestComponent implements OnInit {
  requestId: string | null = null;
  editMode = false;
  documentForm!: FormGroup;

  documentTypes = [
    'Attestation de travail',
    'Attestation de salaire',
    'Autre'
  ];

  urgencyLevels = [
    { value: 'low', label: 'Basse' },
    { value: 'normal', label: 'Normale' },
    { value: 'high', label: 'Haute' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService
  ) {
    this.initForm();
  }

  private initForm() {
    this.documentForm = new FormGroup({
      documentType: new FormControl('', [Validators.required]),
      reason: new FormControl('', [Validators.required]),
      urgency: new FormControl('normal', [Validators.required]),
      purpose: new FormControl(''),
      language: new FormControl('fr'),
      copies: new FormControl(1, [Validators.min(1)]),
      comments: new FormControl('')
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.requestId = id;
      this.editMode = true;
      const request = this.requestsService.getRequestById(id);
      if (request && request.details) {
        this.documentForm.patchValue({
          documentType: request.details.documentType || '',
          reason: request.details.reason || '',
          urgency: request.details.urgency || 'normal',
          purpose: request.details.purpose || '',
          language: request.details.language || 'fr',
          copies: request.details.copies || 1,
          comments: request.details.comments || ''
        });
      }
    }
  }

  onSubmit() {
    if (!this.documentForm.valid) {
      return;
    }

    const formData = this.documentForm.value;
    
    if (this.requestId) {
      this.requestsService.updateDocumentRequest(this.requestId, formData);
    } else {
      this.requestsService.addDocumentRequest(formData);
    }
    this.router.navigate(['/home/requests']);
  }

  onCancel() {
    this.router.navigate(['/home/requests']);
  }
}
