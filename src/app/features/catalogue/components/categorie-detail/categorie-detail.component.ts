import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import { CategorieService } from '../../services/categorie.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Categorie } from '../../../../core/models';

@Component({
  selector: 'app-categorie-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './categorie-detail.component.html',
  styleUrl: './categorie-detail.component.scss'
})
export class CategorieDetailComponent implements OnInit {
  categorie: Categorie | null = null;
  loading = true;

  constructor(
    private categorieService: CategorieService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.loadCategorie(params['id']);
      }
    });
  }

  loadCategorie(id: string): void {
    this.loading = true;
    this.categorieService.getById(id).subscribe({
      next: (categorie) => {
        this.categorie = categorie;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement de la catégorie');
        this.loading = false;
        this.router.navigate(['/catalogue/categories']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/catalogue/categories']);
  }

  getStatusLabel(estActif: boolean): string {
    return estActif ? 'Actif' : 'Inactif';
  }

  getStatusClass(estActif: boolean): string {
    return estActif ? 'active' : 'inactive';
  }
}
