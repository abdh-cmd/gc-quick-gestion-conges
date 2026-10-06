import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface LeaveBalance { total: number; used: number; remaining: number; }
@Injectable({ providedIn: 'root' }) export class SoldeService { private http = inject(HttpClient); get() { return this.http.get<LeaveBalance>('http://localhost:3000/api/solde', { headers: { Authorization: `Bearer ${localStorage.getItem('gc-quick-session') ?? ''}` } }); } }
