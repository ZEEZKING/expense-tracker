import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/api/Auth/register`, data)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/api/Auth/login`, data)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

private handleAuthResponse(response: AuthResponse): void {
  const token = response.data?.token;

  const user = response.data
    ? {
        fullName: response.data.fullName,
        email: response.data.email
      }
    : null;

  if (token && user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  } else {
    console.warn('Invalid auth response structure:', response);
  }
}

  private getUserFromStorage(): any {
    const userJson = localStorage.getItem('user');
    
    if (!userJson || userJson === 'undefined') {
      return null;
    }

    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  }
}
