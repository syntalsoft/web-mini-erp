import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ServiceCatalogueService } from '../../services/service.service';
import { CategorieService } from '../../services/categorie.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Categorie, Service, CreateServiceDto, UpdateServiceDto } from '../../../../core/models';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent implements OnInit {
  form!: FormGroup;
  categories: Categorie[] = [];
  loading = false;
  submitting = false;
  isEditMode = false;
  serviceId?: string;

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceCatalogueService,
    private categorieService: CategorieService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.checkEditMode();
  }

  private createForm(): void {
    this.form = this.fb.group({
      designation: ['', [Validators.required, Validators.maxLength(200)]],
      reference: ['', [Validators.required, Validators.maxLength(50)]],
      categorieId: ['', Validators.required],
      description: ['', Validators.maxLength(2000)],
      prixAchatHT: [0, [Validators.required, Validators.min(0)]],
      prixVenteHT: [0, [Validators.required, Validators.min(0)]],
      tauxTva: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      estActif: [true]
    });
  }

  private loadCategories(): void {
    this.categorieService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement des catégories');
      }
    });
  }

  private checkEditMode(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (this.serviceId) {
      this.isEditMode = true;
      this.loadService();
    }
  }

  private loadService(): void {
    if (!this.serviceId) return;

    this.loading = true;
    this.serviceService.getById(this.serviceId).subscribe({
      next: (service) => {
        this.form.patchValue(service);
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement du service');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Veuillez remplir tous les champs requis');
      return;
    }

    this.submitting = true;

    if (this.isEditMode && this.serviceId) {
      const dto: UpdateServiceDto = this.form.value;
      this.serviceService.update(this.serviceId, dto).subscribe({
        next: () => {
          this.notificationService.success('Service mis à jour avec succès');
          this.router.navigate(['/catalogue/services']);
        },
        error: () => {
          this.notificationService.error('Erreur lors de la mise à jour');
          this.submitting = false;
        }
      });
    } else {
      const dto: CreateServiceDto = this.form.value;
      this.serviceService.create(dto).subscribe({
        next: () => {
          this.notificationService.success('Service créé avec succès');
          this.router.navigate(['/catalogue/services']);
        },
        error: () => {
          this.notificationService.error('Erreur lors de la création');
          this.submitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/catalogue/services']);
  }
}
