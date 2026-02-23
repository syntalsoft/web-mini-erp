import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategorieService } from './categorie.service';
import { Categorie } from '../../../core/models';

describe('CategorieService', () => {
  let service: CategorieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategorieService]
    });

    service = TestBed.inject(CategorieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch all categories', (done) => {
      const mockCategories: Categorie[] = [
        {
          id: 'cat-1',
          libelle: 'Logiciels',
          estActif: true,
          dateCreation: new Date(),
          dateModification: new Date()
        },
        {
          id: 'cat-2',
          libelle: 'Matériel',
          estActif: true,
          dateCreation: new Date(),
          dateModification: new Date()
        }
      ];

      const mockResponse = {
        success: true,
        data: mockCategories
      };

      service.getAll().subscribe((categories) => {
        expect(categories.length).toBe(2);
        expect(categories[0].libelle).toBe('Logiciels');
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('categories') && request.method === 'GET'
      );
      req.flush(mockResponse);
    });
  });

  describe('getById', () => {
    it('should fetch a single category', (done) => {
      const categoryId = 'cat-1';
      const mockResponse = {
        success: true,
        data: {
          id: 'cat-1',
          libelle: 'Logiciels',
          estActif: true,
          dateCreation: new Date(),
          dateModification: new Date()
        } as Categorie
      };

      service.getById(categoryId).subscribe((category) => {
        expect(category.id).toBe('cat-1');
        expect(category.libelle).toBe('Logiciels');
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes(`categories/${categoryId}`) && request.method === 'GET'
      );
      req.flush(mockResponse);
    });
  });
});
