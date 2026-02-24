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

import { CategorieService } from '../../services/categorie.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { Categorie, PagedRequest } from '../../../../core/models';

@Component({
  selector: 'app-categorie-list',
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
  templateUrl: './categorie-list.component.html',
  styleUrl: './categorie-list.component.scss'
})
export class CategorieListComponent implements OnInit {
  categories: Categorie[] = [];
  loading = false;
  totalItems = 0;
  pageSize = 20;
  pageNumber = 1;
  searchTerm = '';

  displayedColumns: string[] = ['libelle', 'estActif', 'dateCreation', 'actions'];

  constructor(
    private categorieService: CategorieService,
    private notificationService: NotificationService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;

    const request: PagedRequest = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      search: this.searchTerm
    };

    this.categorieService.getAll(request).subscribe({
      next: (result) => {
        this.categories = result.items;
        this.totalItems = result.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement des catégories');
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCategories();
  }

  onSearch(): void {
    this.pageNumber = 1;
    this.loadCategories();
  }

  onDelete(categorie: Categorie): void {
    this.confirmDialog.confirmDelete('la catégorie', categorie.libelle).subscribe((confirmed) => {
      if (confirmed) {
        this.categorieService.delete(categorie.id).subscribe({
          next: () => {
            this.notificationService.success('Catégorie supprimée avec succès');
            this.loadCategories();
          },
          error: () => {
            this.notificationService.error('Erreur lors de la suppression de la catégorie');
          }
        });
      }
    });
  }

  getStatusLabel(estActif: boolean): string {
    return estActif ? 'Actif' : 'Inactif';
  }
}
