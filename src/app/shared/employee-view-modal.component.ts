import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-view-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop fade show"></div>
    <div class="modal d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Employee Details</h5>
            <button type="button" class="btn-close" aria-label="Close" (click)="close.emit()"></button>
          </div>
          <div class="modal-body">
            <dl class="row">
              <dt class="col-sm-4">Name</dt>
              <dd class="col-sm-8">{{ employee?.name }}</dd>

              <dt class="col-sm-4">Surname</dt>
              <dd class="col-sm-8">{{ employee?.surname }}</dd>

              <dt class="col-sm-4">Date of Birth</dt>
              <dd class="col-sm-8">{{ employee?.dateOfBirth }}</dd>

              <dt class="col-sm-4">Department</dt>
              <dd class="col-sm-8">{{ employee?.department }}</dd>

              <dt class="col-sm-4">Responsibilities</dt>
              <dd class="col-sm-8">{{ employee?.responsibilities?.join(', ') }}</dd>

              <dt class="col-sm-4">Daily Salary</dt>
              <dd class="col-sm-8">{{ employee ? (employee.dailySalary.toFixed(2)) : '' }}</dd>
              <dt class="col-sm-4">Salary Handling</dt>
              <dd class="col-sm-8">{{ employee?.salaryHandling }}</dd>
            </dl>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="close.emit()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeViewModalComponent {
  @Input() employee?: Employee;
  @Output() close = new EventEmitter<void>();
}
