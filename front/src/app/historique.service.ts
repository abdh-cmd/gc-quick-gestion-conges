import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface HistoryEntry { id: string; action: string; details: string; creeLe: string; }
@Injectable({ providedIn: 'root' }) export class HistoriqueService { private http = inject(HttpClient); list() { return this.http.get<HistoryEntry[]>('http://localhost:3000/api/historique', { headers: { Authorization: `Bearer ${localStorage.getItem('gc-quick-session') ?? ''}` } }); } }
