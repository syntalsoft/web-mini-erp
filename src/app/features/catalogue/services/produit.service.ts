import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/api/api.service';
import {
  Produit,
  CreateProduitDto,
  UpdateProduitDto,
  PagedResult,
  PagedRequest,
  ApiResponse
} from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private endpoint = 'produits';

  constructor(private apiService: ApiService) {}

  /**
   * Get all products with pagination and filters
   */
  getAll(params: PagedRequest): Observable<PagedResult<Produit>> {
    return this.apiService.getPaged<Produit>(this.endpoint, {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      search: params.search || '',
      sortBy: params.sortBy || 'designation',
      sortDirection: params.sortDirection || 'asc'
    }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get product by ID
   */
  getById(id: string): Observable<Produit> {
    return this.apiService.get<Produit>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create new product
   */
  create(dto: CreateProduitDto): Observable<Produit> {
    return this.apiService.post<Produit>(this.endpoint, dto).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update existing product
   */
  update(id: string, dto: UpdateProduitDto): Observable<Produit> {
    return this.apiService.put<Produit>(`${this.endpoint}/${id}`, dto).pipe(
      map(response => response.data)
    );
  }

  /**
   * Delete product by ID
   */
  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`).pipe(
      map(() => undefined)
    );
  }

  /**
   * Search products by term
   */
  search(term: string, pageNumber: number = 1, pageSize: number = 20): Observable<PagedResult<Produit>> {
    return this.getAll({
      pageNumber,
      pageSize,
      search: term
    });
  }

  /**
   * Get products by category
   */
  getByCategory(categorieId: string, pageNumber: number = 1, pageSize: number = 20): Observable<PagedResult<Produit>> {
    return this.apiService.getPaged<Produit>(`${this.endpoint}/category/${categorieId}`, {
      pageNumber,
      pageSize
    }).pipe(
      map(response => response.data)
    );
  }
}
