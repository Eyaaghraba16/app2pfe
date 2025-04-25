import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-leave-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})
export class LeaveRequestComponent implements OnInit {
  request = {
    startDate: '',
    endDate: '',
    leaveType: '',
    reason: '',
    documents: null as File | null
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
          startDate: existingRequest.details.startDate || '',
          endDate: existingRequest.details.endDate || '',
          leaveType: existingRequest.details.leaveType || '',
          reason: existingRequest.details.reason || '',
          documents: null
        };
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.request.documents = file;
    }
  }

  onSubmit() {
    if (this.editMode && this.requestId) {
      this.requestsService.updateLeaveRequest(this.requestId, this.request);
    } else {
      this.requestsService.addLeaveRequest(this.request);
    }
    this.router.navigate(['/home/requests']);
  }

  cancel() {
    this.router.navigate(['/home/requests']);
  }
}
