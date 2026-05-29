import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Decimal from 'decimal.js';
import { Employee, StoredEmployee } from '../models/employee.model';

/**
 * EmployeeService
 * - Persists employees in localStorage using a string representation for decimals
 * - Exposes a reactive `employees$` stream
 */
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly storageKey = 'employees_v2';
  private employeesSubject = new BehaviorSubject<Employee[]>(this.readEmployees());
  employees$ = this.employeesSubject.asObservable();

  private nextId(): number {
    const all = this.getEmployees();
    return all.length === 0 ? 1 : Math.max(...all.map((e) => e.id)) + 1;
  }

  private defaultMockData(): StoredEmployee[] {
    return [
      {
        id: 1,
        name: 'Alice',
        surname: 'Johnson',
        department: 'IT',
        dailySalary: new Decimal(150).toString(),
        salaryHandling: 'Bank',
        responsibilities: ['Development', 'Testing'],
        dateOfBirth: '1990-05-12'
      },
      {
        id: 2,
        name: 'Bob',
        surname: 'Smith',
        department: 'Finance',
        dailySalary: new Decimal(200.5).toString(),
        salaryHandling: 'Cash',
        responsibilities: ['Reporting'],
        dateOfBirth: '1985-09-01'
      }
    ];
  }

  private readEmployees(): Employee[] {
    const stored = localStorage.getItem(this.storageKey);
    let parsed: StoredEmployee[] | null = null;
    if (!stored) {
      // seed with mock data
      parsed = this.defaultMockData();
      localStorage.setItem(this.storageKey, JSON.stringify(parsed));
    } else {
      try {
        parsed = JSON.parse(stored) as StoredEmployee[];
      } catch {
        parsed = this.defaultMockData();
        localStorage.setItem(this.storageKey, JSON.stringify(parsed));
      }
    }

    return (parsed ?? []).map((s) => ({
      id: Number(s.id),
      name: String(s.name ?? ''),
      surname: String(s.surname ?? ''),
      department: String(s.department ?? ''),
      dailySalary: new Decimal(String(s.dailySalary ?? '0')),
      salaryHandling: (s.salaryHandling as any) ?? 'Other',
      responsibilities: Array.isArray(s.responsibilities) ? s.responsibilities.map(String) : [],
      dateOfBirth: s.dateOfBirth ? String(s.dateOfBirth) : undefined
    }));
  }

  private persistEmployees(list: Employee[]): void {
    const stored: StoredEmployee[] = list.map((e) => ({
      id: e.id,
      name: e.name,
      surname: e.surname,
      department: e.department,
      dailySalary: e.dailySalary.toString(),
      salaryHandling: e.salaryHandling,
      responsibilities: e.responsibilities,
      dateOfBirth: e.dateOfBirth
    }));
    localStorage.setItem(this.storageKey, JSON.stringify(stored));
    this.employeesSubject.next(this.getEmployees());
  }

  getEmployees(): Employee[] {
    return this.readEmployees();
  }

  getEmployeeById(id: number): Employee | undefined {
    return this.getEmployees().find((e) => e.id === id);
  }

  addEmployee(employee: Omit<Employee, 'id'>): Employee {
    const id = this.nextId();
    const newEmp: Employee = { ...employee, id };
    const updated = [...this.getEmployees(), newEmp];
    this.persistEmployees(updated);
    return newEmp;
  }

  updateEmployeeById(id: number, employee: Employee): boolean {
    const list = this.getEmployees();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) {
      return false;
    }
    const updated = list.slice();
    updated[idx] = { ...employee, id };
    this.persistEmployees(updated);
    return true;
  }

  deleteEmployeeById(id: number): boolean {
    const list = this.getEmployees();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) {
      return false;
    }
    const updated = list.slice(0, idx).concat(list.slice(idx + 1));
    this.persistEmployees(updated);
    return true;
  }

  refresh(): void {
    this.employeesSubject.next(this.getEmployees());
  }
}
