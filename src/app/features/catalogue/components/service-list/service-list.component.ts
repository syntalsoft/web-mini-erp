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

import { ServiceCatalogueService } from '../../services/service.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Service, PagedRequest } from '../../../../core/models';

@Component({
  selector: 'app-service-list',
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
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent implements OnInit {
  services: Service[] = [];
  loading = false;
  totalItems = 0;
  pageSize = 20;
  pageNumber = 1;
  searchTerm = '';

  displayedColumns: string[] = ['reference', 'designation', 'categorie', 'prixVenteHT', 'actions'];

  constructor(
    private serviceService: ServiceCatalogueService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;

    const request: PagedRequest = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      search: this.searchTerm,
      sortBy: 'designation',
      sortDirection: 'asc'
    };

    this.serviceService.getAll(request).subscribe({
      next: (result) => {
        this.services = result.items;
        this.totalItems = result.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement des services');
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadServices();
  }

  onSearch(): void {
    this.pageNumber = 1;
    this.loadServices();
  }

  onDelete(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      this.serviceService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Service supprimé avec succès');
          this.loadServices();
        },
        error: () => {
          this.notificationService.error('Erreur lors de la suppression du service');
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
