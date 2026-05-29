import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { Title } from '@angular/platform-browser';
import { EmployeeService } from '../../services/employee.service';
import { SelectedEmployeeService } from '../../services/selected-employee.service';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee.model';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [CommonModule, FormlyModule, FormlyBootstrapModule, ReactiveFormsModule],
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent implements OnInit {
  form = new FormGroup({});
  model: any = {
    responsibilities: [],
    dailySalary: '0.00',
    salaryHandling: 'Bank'
  };
  options: FormlyFormOptions = {};
  showSuccess = false;
  editing = false;
  editId: number | null = null;
  pageTitle = 'Create Employee';

  /**
   * Initialise le composant en injectant le service de gestion des employés.
   */
  constructor(
    private employeeService: EmployeeService,
    private selectedEmployeeService: SelectedEmployeeService,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    const selectedId = this.selectedEmployeeService.getSelectedSnapshot();
    if (selectedId !== null && selectedId !== undefined) {
      const emp = this.employeeService.getEmployeeById(selectedId);
      if (emp) {
        this.model = {
          ...emp,
          dailySalary: emp.dailySalary.toFixed(2),
          salaryHandling: emp.salaryHandling
        };
        this.editing = true;
        this.editId = emp.id;
        this.pageTitle = 'Update Employee';
      }
    } else {
      this.pageTitle = 'Create Employee';
    }

    // Set the browser tab title
    this.titleService.setTitle(this.pageTitle);
  }

  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        label: 'Name',
        placeholder: 'Enter first name',
        required: true,
        maxLength: 50
      }
    },
    {
      key: 'surname',
      type: 'input',
      templateOptions: {
        label: 'Surname',
        placeholder: 'Enter surname',
        required: true,
        maxLength: 50
      }
    },
    {
      key: 'dateOfBirth',
      type: 'input',
      templateOptions: {
        type: 'date',
        label: 'Date of Birth',
        placeholder: 'Select date of birth',
        required: true
      }
    },
    {
      key: 'department',
      type: 'select',
      templateOptions: {
        label: 'Department',
        placeholder: 'Select department',
        required: true,
        options: [
          { label: 'HR', value: 'HR' },
          { label: 'IT', value: 'IT' },
          { label: 'Finance', value: 'Finance' },
          { label: 'Marketing', value: 'Marketing' },
          { label: 'Sales', value: 'Sales' }
        ]
      }
    },
    {
      key: 'responsibilities',
      type: 'select',
      templateOptions: {
        label: 'Responsibilities',
        placeholder: 'Select responsibilities',
        options: [
          { label: 'Management', value: 'Management' },
          { label: 'Reporting', value: 'Reporting' },
          { label: 'Customer Support', value: 'Customer Support' },
          { label: 'Development', value: 'Development' },
          { label: 'Testing', value: 'Testing' },
          { label: 'Administration', value: 'Administration' }
        ],
        multiple: true,
        required: false,
        attributes: {
          size: 1
        }
      }
    },
    {
      key: 'dailySalary',
      type: 'input',
      templateOptions: {
        type: 'number',
        label: 'Daily Salary',
        placeholder: 'Enter daily salary',
        required: true,
        min: 0,
        step: 0.01
      }
    },
    {
      key: 'salaryHandling',
      type: 'select',
      templateOptions: {
        label: 'Salary Handling',
        required: true,
        options: [
          { label: 'Bank', value: 'Bank' },
          { label: 'Cash', value: 'Cash' },
          { label: 'Other', value: 'Other' }
        ]
      }
    }
  ];

  /**
   * Valide le formulaire, crée un objet employé et l'enregistre.
   * Affiche ensuite un message de succès temporaire.
   */
  saveEmployee(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const employee: Omit<Employee, 'id'> = {
      name: this.model.name?.trim() ?? '',
      surname: this.model.surname?.trim() ?? '',
      dateOfBirth: this.model.dateOfBirth ?? '',
      department: this.model.department ?? '',
      responsibilities: Array.isArray(this.model.responsibilities)
        ? this.model.responsibilities
        : [],
      dailySalary: new Decimal(String(this.model.dailySalary ?? '0')),
      salaryHandling: this.model.salaryHandling
    };

    if (this.editing && this.editId !== null) {
      const ok = this.employeeService.updateEmployeeById(this.editId, { ...employee, id: this.editId });
      if (!ok) {
        this.employeeService.addEmployee(employee);
      }
    } else {
      this.employeeService.addEmployee(employee);
    }
    this.form.reset();
    this.model = { responsibilities: [] };
    this.options.resetModel?.(this.model);
    this.showSuccess = true;

    setTimeout(() => {
      this.showSuccess = false;
      // After save, navigate back to list for a clearer UX
      this.selectedEmployeeService.clear();
      this.router.navigate(['/employees']);
    }, 4000);
  }
}

