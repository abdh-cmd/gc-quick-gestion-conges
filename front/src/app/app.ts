import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, PublicUser } from './auth.service';
import { CongesService, Employee, LeaveRequest } from './conges.service';
import { NotificationService, AppNotification } from './notification.service';
import { SoldeService, LeaveBalance } from './solde.service';
import { HistoriqueService, HistoryEntry } from './historique.service';
import { ProfilService } from './profil.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly congesService = inject(CongesService);
  private readonly notificationService = inject(NotificationService);
  private readonly soldeService = inject(SoldeService);
  private readonly historiqueService = inject(HistoriqueService);
  private readonly profilService = inject(ProfilService);
  protected readonly title = 'GC Quick';
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly user = signal<PublicUser | null>(null);
  protected readonly activeView = signal('accueil');
  protected readonly requests = signal<LeaveRequest[]>([]);
  protected readonly employees = signal<Employee[]>([]);
  protected readonly selectedRequest = signal<LeaveRequest | null>(null);
  protected readonly notifications = signal<AppNotification[]>([]);
  protected readonly history = signal<HistoryEntry[]>([]);
  protected readonly balance = signal<LeaveBalance | null>(null);
  protected editingRequestId: string | null = null;
  protected email = '';
  protected motDePasse = '';
  protected inscription = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
  };
  protected demande = { type: 'Vacances', dateDebut: '', dateFin: '', motif: '' };
  protected showLoginPassword = false;
  protected showCurrentPassword = false;
  protected showNewPassword = false;
  protected profil = { nom: '', prenom: '', email: '' };
  protected password = { current: '', next: '' };

  constructor() {
    this.loadProfile();
  }

  protected login(): void {
    this.loading.set(true);
    this.error.set('');
    this.authService.login(this.email, this.motDePasse).subscribe({
      next: ({ utilisateur }) => {
        this.user.set(utilisateur);
        this.loadData();
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error.error?.message ?? 'Connexion impossible. Vérifiez vos identifiants.');
        this.loading.set(false);
      },
    });
  }

  protected useDemoAccount(role: 'employee' | 'manager'): void {
    if (role === 'manager') {
      this.email = 'manager@gcquick.fr';
    } else {
      this.email = 'nina@gcquick.fr';
    }
    this.motDePasse = 'Password123';
  }

  protected logout(): void {
    this.authService.logout();
    this.user.set(null);
    this.email = '';
    this.motDePasse = '';
    this.requests.set([]);
    this.employees.set([]);
  }

  protected register(): void {
    this.loading.set(true);
    this.error.set('');
    this.authService.register(this.inscription).subscribe({
      next: ({ utilisateur }) => {
        this.user.set(utilisateur);
        this.loadData();
        this.activeView.set('accueil');
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error.error?.message ?? 'Inscription impossible. Vérifiez les informations saisies.');
        this.loading.set(false);
      },
    });
  }

  protected selectView(view: string): void {
    this.activeView.set(view);
    if (view === 'demandes' || view === 'validation') this.loadRequests();
    if (view === 'employes') this.loadEmployees();
    if (view === 'notifications') this.loadNotifications();
    if (view === 'historique') this.loadHistory();
    if (view === 'profil') this.prepareProfile();
    if (view === 'solde') this.loadBalance();
  }

  protected createRequest(): void {
    const currentUser = this.user();
    if (!currentUser) return;
    this.loading.set(true);
    this.error.set('');
    this.congesService.create(currentUser, this.demande).subscribe({
      next: () => { this.demande = { type: 'Vacances', dateDebut: '', dateFin: '', motif: '' }; this.loading.set(false); this.selectView('demandes'); },
      error: (error) => { this.error.set(error.error?.message ?? 'Création impossible.'); this.loading.set(false); },
    });
  }

  protected editRequest(id: string): void {
    this.loading.set(true);
    this.error.set('');
    this.congesService.getRequest(id).subscribe({
      next: (request) => {
        if (request.status !== 'pending') {
          this.error.set('Seules les demandes en attente sont modifiables.');
          this.loading.set(false);
          return;
        }
        this.editingRequestId = id;
        this.demande = { type: request.type, dateDebut: request.startDate, dateFin: request.endDate, motif: request.reason };
        this.activeView.set('nouvelle-demande');
        this.loading.set(false);
      },
      error: (error) => { this.error.set(error.error?.message ?? 'Demande introuvable.'); this.loading.set(false); },
    });
  }

  protected saveRequest(): void {
    if (this.demande.dateFin < this.demande.dateDebut) {
      this.error.set('La date de fin doit être après la date de début.');
      return;
    }
    if (!this.editingRequestId) { this.createRequest(); return; }
    this.loading.set(true);
    this.error.set('');
    this.congesService.update(this.editingRequestId, this.demande).subscribe({
      next: () => {
        this.editingRequestId = null;
        this.demande = { type: 'Vacances', dateDebut: '', dateFin: '', motif: '' };
        this.loading.set(false);
        this.selectView('demandes');
      },
      error: (error) => { this.error.set(error.error?.message ?? 'Modification impossible.'); this.loading.set(false); },
    });
  }

  protected cancelEdit(): void {
    this.editingRequestId = null;
    this.demande = { type: 'Vacances', dateDebut: '', dateFin: '', motif: '' };
    this.selectView('demandes');
  }

  protected viewRequest(id: string): void {
    this.loading.set(true);
    this.error.set('');
    this.congesService.getRequest(id).subscribe({
      next: (request) => { this.selectedRequest.set(request); this.activeView.set('detail-demande'); this.loading.set(false); },
      error: (error) => { this.error.set(error.error?.message ?? 'Demande introuvable.'); this.loading.set(false); },
    });
  }

  protected deleteRequest(id: string): void {
    this.congesService.remove(id).subscribe({ next: () => this.loadRequests(), error: (error) => this.error.set(error.error?.message ?? 'Suppression impossible.') });
  }

  protected updateStatus(id: string, status: 'approved' | 'rejected'): void {
    this.congesService.updateStatus(id, status).subscribe({ next: () => this.loadRequests(), error: (error) => this.error.set(error.error?.message ?? 'Mise à jour impossible.') });
  }

  protected isManager(): boolean {
    return this.user()?.role === 'manager' || this.user()?.role === 'coach';
  }

  protected count(status: string): number { return this.requests().filter((request) => request.status === status).length; }
  protected totalDays(): number { return this.requests().filter((request) => request.status === 'approved').reduce((total, request) => total + request.days, 0); }
  protected recentRequests(): LeaveRequest[] { return this.requests().slice(0, 5); }
  protected unreadNotifications(): number { return this.notifications().filter((item) => !item.lu).length; }
  protected markNotificationRead(id: string): void { this.notificationService.read(id).subscribe({ next: () => this.loadNotifications() }); }
  protected saveProfile(): void { this.profilService.update(this.profil).subscribe({ next: (user) => { this.user.set(user); this.error.set('Profil mis à jour.'); }, error: (error) => this.error.set(error.error?.message ?? 'Modification impossible.') }); }
  protected savePassword(): void { this.profilService.password(this.password.current, this.password.next).subscribe({ next: () => { this.password = { current: '', next: '' }; this.error.set('Mot de passe mis à jour.'); }, error: (error) => this.error.set(error.error?.message ?? 'Modification impossible.') }); }
  protected togglePassword(field: 'login' | 'current' | 'next'): void {
    if (field === 'login') this.showLoginPassword = !this.showLoginPassword;
    if (field === 'current') this.showCurrentPassword = !this.showCurrentPassword;
    if (field === 'next') this.showNewPassword = !this.showNewPassword;
  }

  private loadProfile(): void {
    this.authService.profile().subscribe({
      next: (user) => { this.user.set(user); this.loadData(); },
      error: () => this.authService.logout(),
    });
  }

  private loadData(): void { this.loadRequests(); this.loadNotifications(); this.loadBalance(); if (this.isManager()) this.loadEmployees(); }
  private loadRequests(): void { if (this.user()) this.congesService.getRequests().subscribe({ next: (requests) => this.requests.set(requests), error: () => this.requests.set([]) }); }
  private loadEmployees(): void { if (this.user() && this.isManager()) this.congesService.getUsers().subscribe({ next: (employees) => this.employees.set(employees), error: () => this.employees.set([]) }); }
  private loadNotifications(): void { if (this.user()) this.notificationService.list().subscribe({ next: (items) => this.notifications.set(items), error: () => this.notifications.set([]) }); }
  private loadHistory(): void { if (this.user()) this.historiqueService.list().subscribe({ next: (items) => this.history.set(items), error: () => this.history.set([]) }); }
  private loadBalance(): void { if (this.user()) this.soldeService.get().subscribe({ next: (item) => this.balance.set(item), error: () => this.balance.set(null) }); }
  private prepareProfile(): void { const user = this.user(); if (user) this.profil = { nom: user.nom, prenom: user.prenom, email: user.email }; }
}
