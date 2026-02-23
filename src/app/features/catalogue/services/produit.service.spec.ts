import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProduitService } from './produit.service';
import { PagedRequest, Produit } from '../../../core/models';

describe('ProduitService', () => {
  let service: ProduitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProduitService]
    });

    service = TestBed.inject(ProduitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch paginated products', (done) => {
      const mockRequest: PagedRequest = {
        pageNumber: 1,
        pageSize: 20,
        search: ''
      };

      const mockResponse = {
        success: true,
        data: {
          items: [
            {
              id: '1',
              designation: 'Product 1',
              reference: 'REF-001',
              prixVenteHT: 100000,
              categorieId: 'cat-1'
            } as Produit
          ],
          totalCount: 1,
          pageNumber: 1,
          pageSize: 20,
          totalPages: 1,
          hasPreviousPage: false,
          hasNextPage: false
        }
      };

      service.getAll(mockRequest).subscribe((result) => {
        expect(result.items.length).toBe(1);
        expect(result.items[0].designation).toBe('Product 1');
        expect(result.totalCount).toBe(1);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('produits') && request.method === 'GET'
      );

      req.flush(mockResponse);
    });
  });

  describe('getById', () => {
    it('should fetch a single product', (done) => {
      const productId = '1';
      const mockResponse = {
        success: true,
        data: {
          id: '1',
          designation: 'Product 1',
          reference: 'REF-001',
          prixVenteHT: 100000,
          categorieId: 'cat-1'
        } as Produit
      };

      service.getById(productId).subscribe((product) => {
        expect(product.id).toBe('1');
        expect(product.designation).toBe('Product 1');
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes(`produits/${productId}`) && request.method === 'GET'
      );
      req.flush(mockResponse);
    });
  });

  describe('create', () => {
    it('should create a new product', (done) => {
      const newProduct = {
        designation: 'New Product',
        reference: 'REF-NEW',
        categorieId: 'cat-1',
        prixAchatHT: 50000,
        prixVenteHT: 100000,
        tauxTva: 18,
        stockMinimum: 5
      };

      const mockResponse = {
        success: true,
        data: {
          id: '2',
          ...newProduct
        } as Produit
      };

      service.create(newProduct).subscribe((product) => {
        expect(product.id).toBe('2');
        expect(product.designation).toBe('New Product');
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('produits') && request.method === 'POST'
      );
      expect(req.request.body).toEqual(newProduct);
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should update an existing product', (done) => {
      const productId = '1';
      const updateData = {
        designation: 'Updated Product',
        prixVenteHT: 150000
      };

      const mockResponse = {
        success: true,
        data: {
          id: '1',
          ...updateData
        } as Produit
      };

      service.update(productId, updateData).subscribe((product) => {
        expect(product.designation).toBe('Updated Product');
        expect(product.prixVenteHT).toBe(150000);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes(`produits/${productId}`) && request.method === 'PUT'
      );
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a product', (done) => {
      const productId = '1';
      const mockResponse = {
        success: true,
        data: null
      };

      service.delete(productId).subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes(`produits/${productId}`) && request.method === 'DELETE'
      );
      req.flush(mockResponse);
    });
  });

  describe('search', () => {
    it('should search products by term', (done) => {
      const searchTerm = 'laptop';
      const mockResponse = {
        success: true,
        data: {
          items: [
            {
              id: '1',
              designation: 'Laptop Dell',
              reference: 'LAPTOP-001',
              prixVenteHT: 500000,
              categorieId: 'cat-1'
            } as Produit
          ],
          totalCount: 1,
          pageNumber: 1,
          pageSize: 20,
          totalPages: 1,
          hasPreviousPage: false,
          hasNextPage: false
        }
      };

      service.search(searchTerm).subscribe((result) => {
        expect(result.items.length).toBe(1);
        expect(result.items[0].designation).toContain('Laptop');
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('produits') && request.params.get('search') === searchTerm
      );
      req.flush(mockResponse);
    });
  });
});
