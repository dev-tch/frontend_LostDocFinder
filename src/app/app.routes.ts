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
    path: 'addDoc',
    loadComponent: () => import('./web-pages/add-document-page/add-document-page.component').then(c => c.addDocumentPageComponent)
  },
  {
    path: 'viewDoc',
    loadComponent: () => import('./web-pages/view-document-page/view-document-page.component').then(c => c.ViewDocumentPageComponent)
  },
  {
    path: 'addReq',
    loadComponent: () => import('./web-pages/add-request-page/add-request-page.component').then(c => c.AddRequestPageComponent)
  },
  {
    path: 'viewReq',
    loadComponent: () => import('./web-pages/view-request-page/view-request-page.component').then(c => c.ViewRequestPageComponent)
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
