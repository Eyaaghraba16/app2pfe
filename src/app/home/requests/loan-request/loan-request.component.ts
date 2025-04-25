import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-loan-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-request.component.html',
  styleUrls: ['./loan-request.component.scss']
})
export class LoanRequestComponent implements OnInit {
  requestId: string | null = null;
  editMode = false;
  loanForm: FormGroup;

  loanInfo: { monthlySalary: number; loanCap: number };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestsService: RequestsService,
    private employeeService: EmployeeService
  ) {
    this.loanInfo = this.employeeService.getMaximumLoanInfo();
    
    this.loanForm = new FormGroup({
      loanType: new FormControl('personal', [Validators.required]),
      loanAmount: new FormControl(0, [
        Validators.required,
        Validators.min(0)
      ]),
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
        this.loanForm.patchValue({
          loanType: request.details.loanType || 'personal',
          loanAmount: request.details.loanAmount || 0,
          attachments: request.details.attachments || null
        });
      }
    }
  }

  onSubmit() {
    if (!this.loanForm.valid) {
      return;
    }

    const formData = new FormData();
    const formValues = this.loanForm.value;
    
    formData.append('loanType', formValues.loanType);
    formData.append('loanAmount', formValues.loanAmount);
    
    const files = formValues.attachments;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('attachments', files[i]);
      }
    }
    
    if (this.requestId) {
      this.requestsService.updateLoanRequest(this.requestId, formData);
    } else {
      this.requestsService.addLoanRequest(formData);
    }
    this.router.navigate(['/home/requests']);
  }

  onCancel() {
    this.router.navigate(['/home/requests']);
  }
}
