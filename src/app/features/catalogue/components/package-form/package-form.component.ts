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

import { PackageService } from '../../services/package.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Package, CreatePackageDto, UpdatePackageDto } from '../../../../core/models';

@Component({
  selector: 'app-package-form',
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
  templateUrl: './package-form.component.html',
  styleUrl: './package-form.component.scss'
})
export class PackageFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitting = false;
  isEditMode = false;
  packageId?: string;

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  private createForm(): void {
    this.form = this.fb.group({
      designation: ['', [Validators.required, Validators.maxLength(200)]],
      reference: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(2000)],
      prixAchatHT: [0, [Validators.required, Validators.min(0)]],
      prixVenteHT: [0, [Validators.required, Validators.min(0)]],
      tauxTva: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      estActif: [true]
    });
  }

  private checkEditMode(): void {
    this.packageId = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (this.packageId) {
      this.isEditMode = true;
      this.loadPackage();
    }
  }

  private loadPackage(): void {
    if (!this.packageId) return;

    this.loading = true;
    this.packageService.getById(this.packageId).subscribe({
      next: (pkg) => {
        this.form.patchValue(pkg);
        this.loading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement du package');
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

    if (this.isEditMode && this.packageId) {
      const dto: UpdatePackageDto = this.form.value;
      this.packageService.update(this.packageId, dto).subscribe({
        next: () => {
          this.notificationService.success('Package mis à jour avec succès');
          this.router.navigate(['/catalogue/packages']);
        },
        error: () => {
          this.notificationService.error('Erreur lors de la mise à jour');
          this.submitting = false;
        }
      });
    } else {
      const dto: CreatePackageDto = this.form.value;
      this.packageService.create(dto).subscribe({
        next: () => {
          this.notificationService.success('Package créé avec succès');
          this.router.navigate(['/catalogue/packages']);
        },
        error: () => {
          this.notificationService.error('Erreur lors de la création');
          this.submitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/catalogue/packages']);
  }
}
