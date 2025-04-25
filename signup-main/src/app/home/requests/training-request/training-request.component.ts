import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-training-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './training-request.component.html',
  styleUrls: ['./training-request.component.scss']
})
export class TrainingRequestComponent implements OnInit {
  request = {
    title: '',
    organization: '',
    startDate: '',
    endDate: '',
    trainingType: '',
    objectives: '',
    cost: 0,
    documents: [] as File[]
  };

  editMode = false;
  requestId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestsService: RequestsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.requestId = Number(id);
      const existingRequest = this.requestsService.getRequestById(this.requestId);
      if (existingRequest && existingRequest.details) {
        this.request = {
          title: existingRequest.details.title || '',
          organization: existingRequest.details.organization || '',
          startDate: existingRequest.details.startDate || '',
          endDate: existingRequest.details.endDate || '',
          trainingType: existingRequest.details.trainingType || '',
          objectives: existingRequest.details.objectives || '',
          cost: existingRequest.details.cost || 0,
          documents: []
        };
      }
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.request.documents = Array.from(files);
    }
  }

  onSubmit() {
    if (this.editMode && this.requestId) {
      this.requestsService.updateTrainingRequest(this.requestId, this.request);
    } else {
      this.requestsService.addTrainingRequest(this.request);
    }
    this.router.navigate(['/home/requests']);
  }

  cancel() {
    this.router.navigate(['/home/requests']);
  }
}
