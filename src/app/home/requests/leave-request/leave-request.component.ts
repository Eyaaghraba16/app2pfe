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
    dayPart: 'full' as 'full' | 'morning' | 'afternoon',
    reason: '',
    documents: null as File | null
  };

  editMode = false;
  requestId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requestsService: RequestsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.requestId = id;
      const existingRequest = this.requestsService.getRequestById(this.requestId);
      if (existingRequest && existingRequest.details) {
        this.request = {
          startDate: existingRequest.details.startDate || '',
          endDate: existingRequest.details.endDate || '',
          leaveType: existingRequest.details.leaveType || '',
          dayPart: existingRequest.details.dayPart || 'full',
          reason: existingRequest.details.reason || '',
          documents: null
        };
      }
    }
  }

  onStartDateChange(event: Event) {
    const startDate = (event.target as HTMLInputElement).value;
    if ((this.request.leaveType === 'maternity' || this.request.leaveType === 'paternity') && startDate) {
      // Calculate end date based on leave type
      const days = this.request.leaveType === 'maternity' ? 98 : 25; // 98 days for maternity (14 weeks)
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + days);
      
      // Format the date as YYYY-MM-DD
      this.request.endDate = end.toISOString().split('T')[0];
    }
  }

  onLeaveTypeChange() {
    if ((this.request.leaveType === 'maternity' || this.request.leaveType === 'paternity') && this.request.startDate) {
      // Calculate end date based on leave type
      const days = this.request.leaveType === 'maternity' ? 98 : 25; // 98 days for maternity (14 weeks)
      const start = new Date(this.request.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + days);
      this.request.endDate = end.toISOString().split('T')[0];
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
