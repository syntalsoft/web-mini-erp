import { Routes } from '@angular/router';
import { ProduitListComponent } from './components/produit-list/produit-list.component';
import { ProduitFormComponent } from './components/produit-form/produit-form.component';
import { ProduitDetailComponent } from './components/produit-detail/produit-detail.component';

export const catalogueRoutes: Routes = [
  {
    path: 'catalogue',
    children: [
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
      {
        path: '',
        redirectTo: 'produits',
        pathMatch: 'full'
      }
    ]
  }
];
