import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ViewType } from '../../services/view.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentView: ViewType = 'home';

  /**
   * Initialise le composant en injectant le routeur Angular
   * afin de gérer la navigation interne sans modifier l'URL visible.
   */
  constructor(private router: Router) {}

  /**
   * Configure l'écoute des événements de navigation Angular
   * pour mettre à jour l'onglet actif du menu principal.
   */
  ngOnInit(): void {
    this.updateCurrentView(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateCurrentView(event.urlAfterRedirects);
      });
  }

  /**
   * Navigue vers la vue demandée en utilisant le routeur Angular.
   * La navigation utilise skipLocationChange pour ne pas modifier l'URL du navigateur.
   */
  setView(view: ViewType): void {
    const route = view === 'home' ? ['/home'] : ['/' + view];
    this.router.navigate(route, { skipLocationChange: true });
    this.closeMobileMenu();
  }

  /**
   * Détermine la vue active à partir de l'URL actuelle
   * et met à jour l'état visuel du menu en conséquence.
   */
  private updateCurrentView(url: string): void {
    if (url.includes('/employees')) {
      this.currentView = 'employees';
    } else if (url.includes('/update-employee')) {
      this.currentView = 'update-employee';
    } else {
      this.currentView = 'home';
    }
  }

  /**
   * Ferme le menu mobile si celui-ci est ouvert,
   * afin de garantir une expérience utilisateur fluide après navigation.
   */
  private closeMobileMenu(): void {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse?.classList.contains('show')) {
      const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement;
      navbarToggler?.click();
    }
  }
}

