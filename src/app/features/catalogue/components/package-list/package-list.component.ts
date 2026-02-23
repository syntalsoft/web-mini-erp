import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PackageService } from '../../services/package.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Package, PagedRequest } from '../../../../core/models';

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './package-list.component.html',
  styleUrl: './package-list.component.scss'
})
export class PackageListComponent implements OnInit {
  packages: Package[] = [];
  loading = false;
  totalItems = 0;
  pageSize = 20;
  pageNumber = 1;
  searchTerm = '';

  displayedColumns: string[] = ['reference', 'designation', 'prixVenteHT', 'compositions', 'actions'];

  constructor(
    private packageService: PackageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.loading = true;

    const request: PagedRequest = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      search: this.searchTerm,
      sortBy: 'designation',
      sortDirection: 'asc'
    };

    this.packageService.getAll(request).subscribe({
      next: (result) => {
        this.packages = result.items;
        this.totalItems = result.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement des packages');
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPackages();
  }

  onSearch(): void {
    this.pageNumber = 1;
    this.loadPackages();
  }

  onDelete(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce package ?')) {
      this.packageService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Package supprimé avec succès');
          this.loadPackages();
        },
        error: () => {
          this.notificationService.error('Erreur lors de la suppression du package');
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

  getCompositionCount(pkg: Package): number {
    return pkg.compositions?.length || 0;
  }
}
