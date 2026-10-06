import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface PublicUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  role: string;
}

interface AuthResponse {
  accessToken: string;
  tokenType: string;
  utilisateur: PublicUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';
  private readonly tokenKey = 'gc-quick-session';

  login(email: string, motDePasse: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
      email,
      motDePasse,
    }).pipe(tap(({ accessToken }) => localStorage.setItem(this.tokenKey, accessToken)));
  }

  register(payload: {
    nom: string;
    prenom: string;
    email: string;
    motDePasse: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, payload).pipe(
      tap(({ accessToken }) => localStorage.setItem(this.tokenKey, accessToken)),
    );
  }

  profile(): Observable<PublicUser> {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return new Observable((subscriber) => subscriber.error(new Error('No token')));
    }
    return this.http.get<PublicUser>(`${this.apiUrl}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
