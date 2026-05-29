import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { UpdateEmployeeComponent } from './pages/update-employee/update-employee.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'update-employee', component: UpdateEmployeeComponent },
  { path: 'update-employee/:index', component: UpdateEmployeeComponent },
  { path: '**', redirectTo: '' }
];
