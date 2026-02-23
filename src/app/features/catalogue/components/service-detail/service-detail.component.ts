import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { ServiceCatalogueService } from '../../services/service.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Service } from '../../../../core/models';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss'
})
export class ServiceDetailComponent implements OnInit {
  service?: Service;
  loading = false;

  constructor(
    private serviceService: ServiceCatalogueService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadService();
  }

  private loadService(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/catalogue/services']);
      return;
    }

    this.loading = true;
    this.serviceService.getById(id).subscribe({
      next: (service) => {
        this.service = service;
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement du service');
        this.loading = false;
      }
    });
  }

  onEdit(): void {
    if (this.service?.id) {
      this.router.navigate(['/catalogue/services', this.service.id, 'edit']);
    }
  }

  onDelete(): void {
    if (!this.service?.id) return;

    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      this.serviceService.delete(this.service.id).subscribe({
        next: () => {
          this.notificationService.success('Service supprimé avec succès');
          this.router.navigate(['/catalogue/services']);
        },
        error: () => {
          this.notificationService.error('Erreur lors de la suppression');
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/catalogue/services']);
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
