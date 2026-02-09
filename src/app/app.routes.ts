import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/auth/auth.guard';
import { permissionGuard } from './core/auth/permission.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component'),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component'),
      },
      // MODULE 1 : Catalogue (ajouté plus tard)
      // { path: 'catalogue', loadChildren: () => ... },

      // MODULE 2 : Prospection (ajouté plus tard)
      // { path: 'prospection', loadChildren: () => ... },

      // MODULE 3 : Ventes (ajouté plus tard)
      // { path: 'ventes', loadChildren: () => ... },
    ],
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./pages/forbidden/forbidden.component'),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component'),
  },
];
