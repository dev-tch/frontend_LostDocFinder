import { Routes } from '@angular/router';
import { NotFoundPageComponent } from "./web-pages/not-found-page/not-found-page.component";
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./web-pages/home-page/home-page.component').then(c => c.HomePageComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./web-pages/register-page/register-page.component').then(c => c.RegisterPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./web-pages/login-page/login-page.component').then(c => c.LoginPageComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./web-pages/dashboard-page/dashboard-page.component').then(c => c.DashboardPageComponent)
  },
  {
    path: 'logout',
    loadComponent: () => import('./web-pages/logout-page/logout-page.component').then(c => c.LogoutPageComponent)
  },
  {
    path: '404',
    component: NotFoundPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  }
];
