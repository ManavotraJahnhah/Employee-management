import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ViewType = 'home' | 'employees' | 'update-employee';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  private currentViewSubject = new BehaviorSubject<ViewType>('home');
  public currentView$ = this.currentViewSubject.asObservable();

  /**
   * Initialise le service de navigation interne sans état externe.
   */
  constructor() {}

  /**
   * Met à jour la vue active partagée avec les composants qui écoutent currentView$.
   */
  setView(view: ViewType): void {
    this.currentViewSubject.next(view);
  }

  /**
   * Retourne directement la vue active actuelle stockée dans le BehaviorSubject.
   */
  getCurrentView(): ViewType {
    return this.currentViewSubject.value;
  }
}
