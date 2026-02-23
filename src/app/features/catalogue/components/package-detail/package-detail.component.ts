import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';

import { PackageService } from '../../services/package.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Package } from '../../../../core/models';

@Component({
  selector: 'app-package-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    RouterModule
  ],
  templateUrl: './package-detail.component.html',
  styleUrl: './package-detail.component.scss'
})
export class PackageDetailComponent implements OnInit {
  package?: Package;
  loading = false;
  compositionColumns: string[] = ['nom', 'type', 'quantite'];

  constructor(
    private packageService: PackageService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadPackage();
  }

  private loadPackage(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/catalogue/packages']);
      return;
    }

    this.loading = true;
    this.packageService.getById(id).subscribe({
      next: (pkg) => {
        this.package = pkg;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement du package');
        this.loading = false;
      }
    });
  }

  onEdit(): void {
    if (this.package?.id) {
      this.router.navigate(['/catalogue/packages', this.package.id, 'edit']);
    }
  }

  onDelete(): void {
    if (!this.package?.id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer ce package ?')) {
      this.packageService.delete(this.package.id).subscribe({
        next: () => {
          this.notificationService.success('Package supprimé avec succès');
          this.router.navigate(['/catalogue/packages']);
        },
        error: () => {
          this.notificationService.error('Erreur lors de la suppression');
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/catalogue/packages']);
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

  getCompositionName(comp: any): string {
    return comp.produit?.designation || comp.service?.designation || '-';
  }

  getCompositionType(comp: any): string {
    return comp.produit ? 'Produit' : 'Service';
  }
}
