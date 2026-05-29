import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';
import { SelectedEmployeeService } from '../../services/selected-employee.service';
import { Employee } from '../../models/employee.model';
import { EmployeeViewModalComponent } from '../../shared/employee-view-modal.component';

import { WjGridModule } from '@mescius/wijmo.angular2.grid';

/**
 * Dedicated model for Wijmo grid display
 */
interface EmployeeGridRow extends Employee {
  responsibilitiesText: string;
  dailySalaryFormatted: string;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeViewModalComponent,
    WjGridModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  /**
   * Data used by the Wijmo grid
   */
  employees: EmployeeGridRow[] = [];

  /**
   * Employee currently displayed in modal
   */
  selectedEmployee?: Employee;

  /**
   * Selected employee id
   */
  selectedId: number | null = null;

  constructor(
    private employeeService: EmployeeService,
    private selectedEmployeeService: SelectedEmployeeService,
    private router: Router
  ) {}

  /**
   * Initialise employee list
   */
  ngOnInit(): void {

    this.employeeService.employees$.subscribe((list) => {
      this.employees = list.map((emp) => ({
        ...emp,
        responsibilitiesText: emp.responsibilities.join(', '),
        dailySalaryFormatted: emp.dailySalary.toFixed(2)
      }));
    });

    this.employeeService.refresh();
  }

  /**
   * Open employee modal
   */
  viewEmployee(id: number): void {
    const emp = this.employeeService.getEmployeeById(id);
    if (emp) {
      this.selectedEmployee = emp;
      this.selectedId = id;
    }
  }

  /**
   * Close employee modal
   */
  closeModal(): void {
    this.selectedEmployee = undefined;
    this.selectedId = null;
  }

  /**
   * Navigate to edit page
   */
  editEmployee(id: number): void {
    this.selectedEmployeeService.setSelected(id);
    this.router.navigate(['/update-employee']);
  }

  /**
   * Delete employee
   */
  deleteEmployee(id: number): void {
    const emp = this.employeeService.getEmployeeById(id);
    if (!emp) {
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete ${emp.name} ${emp.surname}?`
    );
    if (!confirmed) {
      return;
    }
    this.employeeService.deleteEmployeeById(id);
  }
}