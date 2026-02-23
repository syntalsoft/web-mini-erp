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

import { ProduitService } from '../../services/produit.service';
import { CategorieService } from '../../services/categorie.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Categorie, Produit, CreateProduitDto, UpdateProduitDto } from '../../../../core/models';

@Component({
  selector: 'app-produit-form',
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
  templateUrl: './produit-form.component.html',
  styleUrl: './produit-form.component.scss'
})
export class ProduitFormComponent implements OnInit {
  form!: FormGroup;
  categories: Categorie[] = [];
  loading = false;
  submitting = false;
  isEditMode = false;
  produitId?: string;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
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
      stockMinimum: [0, [Validators.required, Validators.min(0)]],
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
    this.produitId = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (this.produitId) {
      this.isEditMode = true;
      this.loadProduit();
    }
  }

  private loadProduit(): void {
    if (!this.produitId) return;

    this.loading = true;
    this.produitService.getById(this.produitId).subscribe({
      next: (produit) => {
        this.form.patchValue(produit);
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement du produit');
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

    if (this.isEditMode && this.produitId) {
      const dto: UpdateProduitDto = this.form.value;
      this.produitService.update(this.produitId, dto).subscribe({
        next: () => {
          this.notificationService.success('Produit mis à jour avec succès');
          this.router.navigate(['/catalogue/produits']);
        },
        error: () => {
          this.notificationService.error('Erreur lors de la mise à jour');
          this.submitting = false;
        }
      });
    } else {
      const dto: CreateProduitDto = this.form.value;
      this.produitService.create(dto).subscribe({
        next: () => {
          this.notificationService.success('Produit créé avec succès');
          this.router.navigate(['/catalogue/produits']);
        },
        error: () => {
          this.notificationService.error('Erreur lors de la création');
          this.submitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/catalogue/produits']);
  }
}
