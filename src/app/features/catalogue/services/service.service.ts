import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/api/api.service';
import {
  Service,
  CreateServiceDto,
  UpdateServiceDto,
  PagedResult,
  PagedRequest
} from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class ServiceCatalogueService {
  private endpoint = 'services';

  constructor(private apiService: ApiService) {}

  /**
   * Get all services with pagination and filters
   */
  getAll(params: PagedRequest): Observable<PagedResult<Service>> {
    return this.apiService.getPaged<Service>(this.endpoint, {
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
   * Get service by ID
   */
  getById(id: string): Observable<Service> {
    return this.apiService.get<Service>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create new service
   */
  create(dto: CreateServiceDto): Observable<Service> {
    return this.apiService.post<Service>(this.endpoint, dto).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update existing service
   */
  update(id: string, dto: UpdateServiceDto): Observable<Service> {
    return this.apiService.put<Service>(`${this.endpoint}/${id}`, dto).pipe(
      map(response => response.data)
    );
  }

  /**
   * Delete service by ID
   */
  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`).pipe(
      map(() => undefined)
    );
  }

  /**
   * Search services by term
   */
  search(term: string, pageNumber: number = 1, pageSize: number = 20): Observable<PagedResult<Service>> {
    return this.getAll({
      pageNumber,
      pageSize,
      search: term
    });
  }

  /**
   * Get services by category
   */
  getByCategory(categorieId: string, pageNumber: number = 1, pageSize: number = 20): Observable<PagedResult<Service>> {
    return this.apiService.getPaged<Service>(`${this.endpoint}/category/${categorieId}`, {
      pageNumber,
      pageSize
    }).pipe(
      map(response => response.data)
    );
  }
}
