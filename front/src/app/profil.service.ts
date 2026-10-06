import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PublicUser } from './auth.service';
@Injectable({ providedIn: 'root' }) export class ProfilService { private http = inject(HttpClient); private headers() { return { Authorization: `Bearer ${localStorage.getItem('gc-quick-session') ?? ''}` }; } update(profile: Pick<PublicUser, 'nom' | 'prenom' | 'email'>) { return this.http.patch<PublicUser>('http://localhost:3000/auth/profile', profile, { headers: this.headers() }); } password(currentPassword: string, newPassword: string) { return this.http.patch('http://localhost:3000/auth/password', { currentPassword, newPassword }, { headers: this.headers() }); } }
