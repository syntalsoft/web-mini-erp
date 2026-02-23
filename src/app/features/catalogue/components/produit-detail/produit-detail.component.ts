import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { ProduitService } from '../../services/produit.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Produit } from '../../../../core/models';

@Component({
  selector: 'app-produit-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './produit-detail.component.html',
  styleUrl: './produit-detail.component.scss'
})
export class ProduitDetailComponent implements OnInit {
  produit?: Produit;
  loading = false;

  constructor(
    private produitService: ProduitService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProduit();
  }

  private loadProduit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/catalogue/produits']);
      return;
    }

    this.loading = true;
    this.produitService.getById(id).subscribe({
      next: (produit) => {
        this.produit = produit;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement du produit');
        this.loading = false;
      }
    });
  }

  onEdit(): void {
    if (this.produit?.id) {
      this.router.navigate(['/catalogue/produits', this.produit.id, 'edit']);
    }
  }

  onDelete(): void {
    if (!this.produit?.id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.delete(this.produit.id).subscribe({
        next: () => {
          this.notificationService.success('Produit supprimé avec succès');
          this.router.navigate(['/catalogue/produits']);
        },
        error: () => {
          this.notificationService.error('Erreur lors de la suppression');
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/catalogue/produits']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  }

  calculatePriceTTC(prixHT: number, tauxTva: number): number {
    return prixHT * (1 + tauxTva / 100);
  }
}
