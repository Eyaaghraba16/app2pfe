import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestsService } from '../requests.service';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-loan-request',
  templateUrl: './loan-request.component.html',
  styleUrls: ['./loan-request.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CurrencyPipe],
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
    private authService: AuthService,
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
      this.requestsService.getRequestById(id).subscribe(request => {
        if (request && request.details) {
          this.loanForm.patchValue({
            loanType: request.details.loanType || 'personal',
            loanAmount: request.details.loanAmount || 0,
            attachments: request.details.attachments || null
          });
        }
      });
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
      // Construction de l'objet Request pour addRequest
      const currentUser = this.authService.currentUserValue;
      const newRequest = {
        requestType: 'loan',
        id: Math.random().toString(36).substr(2, 9),
        type: "Prêt bancaire",
        date: new Date().toISOString(),
        status: 'En attente',
        userId: currentUser?.id || '',
        details: {
          loanAmount: String(this.loanForm.value.loanAmount),
          reason: '',
          documents: this.loanForm.value.attachments as any
        },
        description: `Demande de prêt bancaire - ${this.loanForm.value.loanAmount} DT`,
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
