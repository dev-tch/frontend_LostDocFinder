import { Routes } from '@angular/router';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LogoutComponent } from './components/logout/logout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
export const routes: Routes = [
     {path: 'home', component: HomeComponent },
     { path: 'register', component: RegisterComponent },
     { path: 'login', component: LoginComponent },
     { path: 'logout', component: LogoutComponent },
     { path: 'dashboard', component: DashboardComponent },
     { path: '',   redirectTo: '/home', pathMatch: 'full' }
]; 