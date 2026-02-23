import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/api/api.service';
import {
  Package,
  CreatePackageDto,
  UpdatePackageDto,
  PagedResult,
  PagedRequest
} from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private endpoint = 'packages';

  constructor(private apiService: ApiService) {}

  /**
   * Get all packages with pagination and filters
   */
  getAll(params: PagedRequest): Observable<PagedResult<Package>> {
    return this.apiService.getPaged<Package>(this.endpoint, {
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
   * Get package by ID
   */
  getById(id: string): Observable<Package> {
    return this.apiService.get<Package>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create new package
   */
  create(dto: CreatePackageDto): Observable<Package> {
    return this.apiService.post<Package>(this.endpoint, dto).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update existing package
   */
  update(id: string, dto: UpdatePackageDto): Observable<Package> {
    return this.apiService.put<Package>(`${this.endpoint}/${id}`, dto).pipe(
      map(response => response.data)
    );
  }

  /**
   * Delete package by ID
   */
  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`).pipe(
      map(() => undefined)
    );
  }

  /**
   * Search packages by term
   */
  search(term: string, pageNumber: number = 1, pageSize: number = 20): Observable<PagedResult<Package>> {
    return this.getAll({
      pageNumber,
      pageSize,
      search: term
    });
  }
}
