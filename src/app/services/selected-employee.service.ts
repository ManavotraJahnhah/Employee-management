import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectedEmployeeService {
  private selectedSubject = new BehaviorSubject<number | null>(null);
  selected$ = this.selectedSubject.asObservable();

  setSelected(id: number | null): void {
    this.selectedSubject.next(id);
  }

  getSelectedSnapshot(): number | null {
    return this.selectedSubject.getValue();
  }

  clear(): void {
    this.selectedSubject.next(null);
  }
}
