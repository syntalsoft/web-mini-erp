import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  ChangePasswordRequest
} from '../models/auth-response.model';
import { ApiResponse } from '../models/api-response.model';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'mini_erp_access_token',
  REFRESH_TOKEN: 'mini_erp_refresh_token',
  USER: 'mini_erp_user',
} as const;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.authUrl}/login`, request)
      .pipe(tap(response => {
        if (response.success) {
          this.storeAuthData(response.data);
        }
      }));
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const request: RefreshTokenRequest = {
      accessToken: this.getAccessToken() || '',
      refreshToken: this.getRefreshToken() || '',
    };
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.authUrl}/refresh`, request)
      .pipe(tap(response => {
        if (response.success) {
          this.storeAuthData(response.data);
        }
      }));
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http
        .post(`${this.authUrl}/logout`, { refreshToken })
        .subscribe({ error: () => {} });
    }
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.authUrl}/change-password`, request);
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate > new Date();
    } catch {
      return false;
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles?.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    return roles.some(role => user?.roles?.includes(role)) ?? false;
  }

  hasPermission(permission: string): boolean {
    const user = this.getUser();
    return user?.permissions?.includes(permission) ?? false;
  }

  private storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authResponse.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authResponse.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authResponse.user));
    this.currentUserSubject.next(authResponse.user);
  }

  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    this.currentUserSubject.next(null);
  }

  private loadUser(): User | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }
}
