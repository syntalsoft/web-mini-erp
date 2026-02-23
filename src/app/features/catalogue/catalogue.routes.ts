import { Routes } from '@angular/router';
import { ProduitListComponent } from './components/produit-list/produit-list.component';
import { ProduitFormComponent } from './components/produit-form/produit-form.component';
import { ProduitDetailComponent } from './components/produit-detail/produit-detail.component';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { ServiceFormComponent } from './components/service-form/service-form.component';
import { ServiceDetailComponent } from './components/service-detail/service-detail.component';
import { PackageListComponent } from './components/package-list/package-list.component';
import { PackageFormComponent } from './components/package-form/package-form.component';
import { PackageDetailComponent } from './components/package-detail/package-detail.component';

export const catalogueRoutes: Routes = [
  {
    path: 'catalogue',
    children: [
      // Produits
      {
        path: 'produits',
        component: ProduitListComponent
      },
      {
        path: 'produits/new',
        component: ProduitFormComponent
      },
      {
        path: 'produits/:id',
        component: ProduitDetailComponent
      },
      {
        path: 'produits/:id/edit',
        component: ProduitFormComponent
      },
      // Services
      {
        path: 'services',
        component: ServiceListComponent
      },
      {
        path: 'services/new',
        component: ServiceFormComponent
      },
      {
        path: 'services/:id',
        component: ServiceDetailComponent
      },
      {
        path: 'services/:id/edit',
        component: ServiceFormComponent
      },
      // Packages
      {
        path: 'packages',
        component: PackageListComponent
      },
      {
        path: 'packages/new',
        component: PackageFormComponent
      },
      {
        path: 'packages/:id',
        component: PackageDetailComponent
      },
      {
        path: 'packages/:id/edit',
        component: PackageFormComponent
      },
      {
        path: '',
        redirectTo: 'produits',
        pathMatch: 'full'
      }
    ]
  }
];
