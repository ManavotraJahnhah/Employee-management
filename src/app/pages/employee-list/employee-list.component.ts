import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';
import { SelectedEmployeeService } from '../../services/selected-employee.service';
import { Employee } from '../../models/employee.model';
import { EmployeeViewModalComponent } from '../../shared/employee-view-modal.component';

import { WjGridModule } from '@mescius/wijmo.angular2.grid';
import { WjGridFilterModule } from '@mescius/wijmo.angular2.grid.filter';

import { FlexGrid } from '@mescius/wijmo.grid';
import { FlexGridFilter } from '@mescius/wijmo.grid.filter';
import { WjGridSearchModule } from '@mescius/wijmo.angular2.grid.search';
import { WjInputModule } from '@mescius/wijmo.angular2.input';

/**
 * Grid model
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
    WjGridFilterModule,
    WjGridSearchModule,
    WjInputModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {

  /** Grid data */
  employees: EmployeeGridRow[] = [];

  /** Modal */
  selectedEmployee?: Employee;

  selectedId: number | null = null;

  /** Wijmo grid reference */
  @ViewChild('flex', { static: false }) flex!: FlexGrid;

  /** Filter instance */
  private filter!: FlexGridFilter;

  constructor(
    private employeeService: EmployeeService,
    private selectedEmployeeService: SelectedEmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeService.employees$.subscribe((list) => {
      this.employees = list.map(emp => ({
        ...emp,
        responsibilitiesText: emp.responsibilities.join(', '),
        dailySalaryFormatted: emp.dailySalary.toFixed(2)
      }));
    });

    this.employeeService.refresh();
  }

  ngAfterViewInit(): void {
    // IMPORTANT: activate Wijmo filter here
    this.filter = new FlexGridFilter(this.flex, {
      showFilterIcons: true
    });
  }

  /** View employee */
  viewEmployee(id: number): void {
    const emp = this.employeeService.getEmployeeById(id);
    if (emp) {
      this.selectedEmployee = emp;
      this.selectedId = id;
    }
  }

  /** Close modal */
  closeModal(): void {
    this.selectedEmployee = undefined;
    this.selectedId = null;
  }

  /** Edit */
  editEmployee(id: number): void {
    this.selectedEmployeeService.setSelected(id);
    this.router.navigate(['/update-employee']);
  }

  /** Delete */
  deleteEmployee(id: number): void {
    const emp = this.employeeService.getEmployeeById(id);
    if (!emp) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${emp.name} ${emp.surname}?`
    );

    if (confirmed) {
      this.employeeService.deleteEmployeeById(id);
    }
  }
}