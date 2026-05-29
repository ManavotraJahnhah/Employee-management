import Decimal from 'decimal.js';

export type SalaryHandling = 'Cash' | 'Bank' | 'Other';

export interface Employee {
  id: number;
  name: string;
  surname: string;
  department: string;
  dailySalary: Decimal;
  salaryHandling: SalaryHandling;
  responsibilities: string[];
  dateOfBirth?: string;
}

// Shape used to persist employees in localStorage
export interface StoredEmployee {
  id: number;
  name: string;
  surname: string;
  department: string;
  dailySalary: string; // stored as string to preserve precision
  salaryHandling: SalaryHandling;
  responsibilities: string[];
  dateOfBirth?: string;
}
