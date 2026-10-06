import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicUser } from './auth.service';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  userId: string;
  employeeName: string;
  employeeEmail: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  managerComment: string;
}

export interface Employee {
  id: string;
  nom: string;
  prenom: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  matricule: string;
}

@Injectable({ providedIn: 'root' })
export class CongesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api';

  private headers() {
    const token = localStorage.getItem('gc-quick-session');
    return { Authorization: `Bearer ${token ?? ''}` };
  }

  getRequests(): Observable<LeaveRequest[]> { return this.http.get<LeaveRequest[]>(`${this.apiUrl}/conges`, { headers: this.headers() }); }
  getRequest(id: string): Observable<LeaveRequest> { return this.http.get<LeaveRequest>(`${this.apiUrl}/conges/${id}`, { headers: this.headers() }); }
  getUsers(): Observable<Employee[]> { return this.http.get<Employee[]>(`${this.apiUrl}/users`, { headers: this.headers() }); }
  create(user: PublicUser, form: { type: string; dateDebut: string; dateFin: string; motif: string }) {
    return this.http.post<{ request: LeaveRequest }>(`${this.apiUrl}/conges`, { userId: user.id, ...form }, { headers: this.headers() });
  }
  update(id: string, form: { type: string; dateDebut: string; dateFin: string; motif: string }) {
    return this.http.put<{ request: LeaveRequest }>(`${this.apiUrl}/conges/${id}`, form, { headers: this.headers() });
  }
  updateStatus(id: string, statut: LeaveStatus, commentaireManager = '') {
    return this.http.patch<{ request: LeaveRequest }>(`${this.apiUrl}/conges/${id}/status`, { statut, commentaireManager }, { headers: this.headers() });
  }
  remove(id: string) { return this.http.delete(`${this.apiUrl}/conges/${id}`, { headers: this.headers() }); }
}
