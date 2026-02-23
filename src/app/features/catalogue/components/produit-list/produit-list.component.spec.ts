import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProduitListComponent } from './produit-list.component';
import { ProduitService } from '../../services/produit.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { of, Observable } from 'rxjs';
import { Produit, PagedResult } from '../../../../core/models';
import { ActivatedRoute } from '@angular/router';

describe('ProduitListComponent', () => {
  let component: ProduitListComponent;
  let fixture: ComponentFixture<ProduitListComponent>;
  let produitService: jasmine.SpyObj<ProduitService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let confirmDialog: jasmine.SpyObj<ConfirmDialogService>;

  const mockProduits: Produit[] = [
    {
      id: '1',
      designation: 'Product 1',
      reference: 'REF-001',
      prixVenteHT: 100000,
      prixAchatHT: 50000,
      tauxTva: 18,
      stockMinimum: 5,
      estActif: true,
      categorieId: 'cat-1',
      dateCreation: new Date(),
      dateModification: new Date()
    } as Produit
  ];

  const mockPagedResult: PagedResult<Produit> = {
    items: mockProduits,
    totalCount: 1,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  };

  beforeEach(async () => {
    const produitServiceSpy = jasmine.createSpyObj('ProduitService', [
      'getAll',
      'getById',
      'create',
      'update',
      'delete'
    ]);

    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'success',
      'error'
    ]);

    const confirmDialogSpy = jasmine.createSpyObj('ConfirmDialogService', [
      'confirmDelete'
    ]);

    await TestBed.configureTestingModule({
      imports: [ProduitListComponent],
      providers: [
        { provide: ProduitService, useValue: produitServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: ConfirmDialogService, useValue: confirmDialogSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} }
          }
        }
      ]
    }).compileComponents();

    produitService = TestBed.inject(ProduitService) as jasmine.SpyObj<ProduitService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    confirmDialog = TestBed.inject(ConfirmDialogService) as jasmine.SpyObj<ConfirmDialogService>;

    fixture = TestBed.createComponent(ProduitListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadProduits', () => {
    it('should load products and set totalItems', () => {
      produitService.getAll.and.returnValue(of(mockPagedResult));

      component.loadProduits();

      expect(produitService.getAll).toHaveBeenCalled();
      expect(component.produits).toEqual(mockProduits);
      expect(component.totalItems).toBe(1);
      expect(component.loading).toBe(false);
    });

    it('should handle error when loading products', () => {
      produitService.getAll.and.returnValue(
        new Observable((observer) => observer.error(new Error('Test error')))
      );

      component.loadProduits();

      expect(notificationService.error).toHaveBeenCalledWith(
        'Erreur lors du chargement des produits'
      );
      expect(component.loading).toBe(false);
    });
  });

  describe('onPageChange', () => {
    it('should update page number and reload products', () => {
      produitService.getAll.and.returnValue(of(mockPagedResult));

      component.onPageChange({ pageIndex: 1, pageSize: 50, length: 100 });

      expect(component.pageNumber).toBe(2);
      expect(component.pageSize).toBe(50);
      expect(produitService.getAll).toHaveBeenCalled();
    });
  });

  describe('onSearch', () => {
    it('should reset to page 1 and search', () => {
      produitService.getAll.and.returnValue(of(mockPagedResult));
      component.pageNumber = 5;
      component.searchTerm = 'laptop';

      component.onSearch();

      expect(component.pageNumber).toBe(1);
      expect(produitService.getAll).toHaveBeenCalled();
    });
  });

  describe('onDelete', () => {
    it('should delete product when confirmed', () => {
      confirmDialog.confirmDelete.and.returnValue(of(true));
      produitService.delete.and.returnValue(of(undefined));
      produitService.getAll.and.returnValue(of(mockPagedResult));

      const produit = mockProduits[0];
      component.onDelete(produit);

      expect(confirmDialog.confirmDelete).toHaveBeenCalledWith(
        'le produit',
        'Product 1'
      );
      expect(produitService.delete).toHaveBeenCalledWith('1');
      expect(notificationService.success).toHaveBeenCalledWith(
        'Produit supprimé avec succès'
      );
    });

    it('should not delete when user cancels', () => {
      confirmDialog.confirmDelete.and.returnValue(of(false));

      const produit = mockProduits[0];
      component.onDelete(produit);

      expect(produitService.delete).not.toHaveBeenCalled();
    });
  });

  describe('formatPrice', () => {
    it('should format price as currency', () => {
      const formatted = component.formatPrice(100000);

      expect(formatted).toContain('100');
      expect(formatted).toContain('000');
    });
  });
});
