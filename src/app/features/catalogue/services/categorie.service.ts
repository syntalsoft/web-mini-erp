import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/api/api.service';
import { Categorie } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private endpoint = 'categories';

  constructor(private apiService: ApiService) {}

  /**
   * Get all categories (no pagination, for dropdowns)
   */
  getAll(): Observable<Categorie[]> {
    return this.apiService.get<Categorie[]>(this.endpoint).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get category by ID
   */
  getById(id: string): Observable<Categorie> {
    return this.apiService.get<Categorie>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data)
    );
  }

  /**
   * Create new category
   */
  create(categorie: Categorie): Observable<Categorie> {
    return this.apiService.post<Categorie>(this.endpoint, categorie).pipe(
      map(response => response.data)
    );
  }

  /**
   * Update existing category
   */
  update(id: string, categorie: Partial<Categorie>): Observable<Categorie> {
    return this.apiService.put<Categorie>(`${this.endpoint}/${id}`, categorie).pipe(
      map(response => response.data)
    );
  }

  /**
   * Delete category by ID
   */
  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`).pipe(
      map(() => undefined)
    );
  }
}
