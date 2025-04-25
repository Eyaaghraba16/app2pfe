import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export interface Employee {
  id: string;
  salary: number;
  name: string;
  position: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // Simulation des données employés (à remplacer par une vraie API)
  private employees: Employee[] = [
    { id: '1', salary: 3000, name: 'John Doe', position: 'Développeur' },
    { id: '2', salary: 4000, name: 'Jane Smith', position: 'Chef de projet' },
    { id: '3', salary: 3500, name: 'Bob Johnson', position: 'Designer' }
  ];

  constructor(private authService: AuthService) {}

  getCurrentEmployee(): Employee | null {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return null;
    
    return this.employees.find(e => e.id === currentUser.id) || null;
  }

  getCurrentEmployeeSalary(): number {
    const employee = this.getCurrentEmployee();
    return employee ? employee.salary : 0;
  }

  getMaximumLoanInfo(): { monthlySalary: number; loanCap: number } {
    const salary = this.getCurrentEmployeeSalary();
    
    return {
      monthlySalary: salary,
      loanCap: Number.MAX_SAFE_INTEGER // Pas de limite sur le montant du prêt
    };
  }
}
