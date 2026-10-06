import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface AppNotification { id: string; message: string; lu: boolean; creeLe: string; }
@Injectable({ providedIn: 'root' }) export class NotificationService { private http = inject(HttpClient); private headers() { return { Authorization: `Bearer ${localStorage.getItem('gc-quick-session') ?? ''}` }; } list() { return this.http.get<AppNotification[]>('http://localhost:3000/api/notifications', { headers: this.headers() }); } read(id: string) { return this.http.patch(`http://localhost:3000/api/notifications/${id}/read`, {}, { headers: this.headers() }); } }
