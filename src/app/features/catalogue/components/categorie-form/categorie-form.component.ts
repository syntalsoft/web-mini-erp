import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

import { CategorieService } from '../../services/categorie.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Categorie } from '../../../../core/models';

@Component({
  selector: 'app-categorie-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './categorie-form.component.html',
  styleUrl: './categorie-form.component.scss'
})
export class CategorieFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitting = false;
  isEditMode = false;
  categorieId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private categorieService: CategorieService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.categorieId = params['id'];
        this.loadCategorie();
      }
    });
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.maxLength(200)]],
      estActif: [true]
    });
  }

  loadCategorie(): void {
    if (!this.categorieId) return;

    this.loading = true;
    this.categorieService.getById(this.categorieId).subscribe({
      next: (categorie) => {
        this.form.patchValue({
          libelle: categorie.libelle,
          estActif: categorie.estActif
        });
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('Erreur lors du chargement de la catégorie');
        this.loading = false;
        this.router.navigate(['/catalogue/categories']);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.notificationService.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.submitting = true;
    const formData = this.form.value;

    if (this.isEditMode && this.categorieId) {
      this.categorieService.update(this.categorieId, formData).subscribe({
        next: () => {
          this.notificationService.success('Catégorie modifiée avec succès');
          this.router.navigate(['/catalogue/categories']);
          this.submitting = false;
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la modification de la catégorie');
          this.submitting = false;
        }
      });
    } else {
      this.categorieService.create(formData).subscribe({
        next: () => {
          this.notificationService.success('Catégorie créée avec succès');
          this.router.navigate(['/catalogue/categories']);
          this.submitting = false;
        },
        error: (error) => {
          this.notificationService.error('Erreur lors de la création de la catégorie');
          this.submitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/catalogue/categories']);
  }
}
