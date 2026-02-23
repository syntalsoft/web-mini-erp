import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProduitService } from '../../services/produit.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Produit, PagedRequest } from '../../../../core/models';

@Component({
  selector: 'app-produit-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './produit-list.component.html',
  styleUrl: './produit-list.component.scss'
})
export class ProduitListComponent implements OnInit {
  produits: Produit[] = [];
  loading = false;
  totalItems = 0;
  pageSize = 20;
  pageNumber = 1;
  searchTerm = '';

  displayedColumns: string[] = ['reference', 'designation', 'categorie', 'prixVenteHT', 'stockMinimum', 'actions'];

  constructor(
    private produitService: ProduitService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.loading = true;

    const request: PagedRequest = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      search: this.searchTerm,
      sortBy: 'designation',
      sortDirection: 'asc'
    };

    this.produitService.getAll(request).subscribe({
      next: (result) => {
        this.produits = result.items;
        this.totalItems = result.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement des produits');
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProduits();
  }

  onSearch(): void {
    this.pageNumber = 1;
    this.loadProduits();
  }

  onDelete(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Produit supprimé avec succès');
          this.loadProduits();
        },
        error: () => {
          this.notificationService.error('Erreur lors de la suppression du produit');
        }
      });
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  }
}
