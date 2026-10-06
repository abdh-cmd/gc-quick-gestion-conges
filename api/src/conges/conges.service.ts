import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { Demande, TypeDemande, Utilisateur } from '../entities';
import { HistoriqueService } from '../historique/historique.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateDemandeDto } from './dto/create-demande.dto';
import { UpdateDemandeDto } from './dto/update-demande.dto';
import { UpdateStatutDto } from './dto/update-statut.dto';

@Injectable()
export class CongesService {
  constructor(
    @InjectRepository(Demande) private readonly demandes: Repository<Demande>,
    @InjectRepository(TypeDemande) private readonly types: Repository<TypeDemande>,
    @InjectRepository(Utilisateur) private readonly users: Repository<Utilisateur>,
    private readonly notifications: NotificationsService,
    private readonly historique: HistoriqueService,
  ) {}
  async findAll(userId: string, role: string) {
    const items = await this.demandes.find({ relations: { utilisateur: true, typeDemande: true }, order: { dateDebut: 'DESC' } });
    return items.filter((item) => role === 'manager' || role === 'coach' || item.utilisateur.id === userId).map((item) => this.toResponse(item));
  }
  async findOne(id: string, userId: string, role: string) { const item = await this.get(id); this.assertAccess(item, userId, role); return this.toResponse(item); }
  async create(dto: CreateDemandeDto, requesterId: string) {
    if (dto.userId !== requesterId) throw new ForbiddenException('Vous ne pouvez créer une demande que pour votre compte.');
    const [utilisateur, typeDemande] = await Promise.all([this.users.findOneBy({ id: dto.userId }), this.types.findOne({ where: [{ id: dto.type }, { libelle: dto.type }] })]);
    if (!utilisateur || !typeDemande) throw new BadRequestException('Utilisateur ou type de demande introuvable.');
    const saved = await this.demandes.save(this.demandes.create({ id: randomUUID(), dateDebut: dto.dateDebut, dateFin: dto.dateFin, motif: dto.motif, statut: 'en_attente', commentaireManager: '', utilisateur, typeDemande }));
    await this.historique.log(requesterId, 'Demande créée', `Création d'une demande ${typeDemande.libelle}.`, saved.id);
    return { message: 'Demande créée.', request: this.toResponse(saved) };
  }
  async update(id: string, dto: UpdateDemandeDto, requesterId: string, role: string) {
    const item = await this.get(id); this.assertAccess(item, requesterId, role);
    if (item.statut !== 'en_attente') throw new BadRequestException('Seules les demandes en attente sont modifiables.');
    const typeDemande = await this.types.findOne({ where: [{ id: dto.type }, { libelle: dto.type }] });
    if (!typeDemande) throw new BadRequestException('Type de demande introuvable.');
    Object.assign(item, { dateDebut: dto.dateDebut, dateFin: dto.dateFin, motif: dto.motif, typeDemande });
    const saved = await this.demandes.save(item); await this.historique.log(requesterId, 'Demande modifiée', `Modification d'une demande ${typeDemande.libelle}.`, id);
    return { message: 'Demande modifiée.', request: this.toResponse(saved) };
  }
  async updateStatus(id: string, dto: UpdateStatutDto, requesterId: string, role: string) {
    if (role !== 'manager' && role !== 'coach') throw new ForbiddenException('Réservé au manager.');
    const item = await this.get(id); const statuses = { pending: 'en_attente', approved: 'validee', rejected: 'refusee' } as const;
    item.statut = statuses[dto.statut]; item.commentaireManager = dto.commentaireManager?.trim() ?? '';
    const saved = await this.demandes.save(item); const label = dto.statut === 'approved' ? 'validée' : dto.statut === 'rejected' ? 'refusée' : 'mise en attente';
    await this.notifications.create(item.utilisateur.id, `Votre demande de ${item.typeDemande.libelle} a été ${label}.`);
    await this.historique.log(item.utilisateur.id, `Demande ${label}`, `Décision du manager : demande ${label}.`, id);
    return { message: 'Statut mis à jour.', request: this.toResponse(saved) };
  }
  async remove(id: string, requesterId: string, role: string) { const item = await this.get(id); this.assertAccess(item, requesterId, role); if (item.statut !== 'en_attente') throw new BadRequestException('Seules les demandes en attente sont supprimables.'); await this.demandes.remove(item); await this.historique.log(requesterId, 'Demande supprimée', 'Suppression d’une demande en attente.', id); return { message: 'Demande supprimée.' }; }
  private async get(id: string) { const item = await this.demandes.findOne({ where: { id }, relations: { utilisateur: true, typeDemande: true } }); if (!item) throw new NotFoundException('Demande introuvable.'); return item; }
  private assertAccess(item: Demande, userId: string, role: string) { if (role !== 'manager' && role !== 'coach' && item.utilisateur.id !== userId) throw new ForbiddenException('Accès refusé.'); }
  private toResponse(item: Demande) { const map: Record<string, string> = { en_attente: 'pending', validee: 'approved', refusee: 'rejected' }; const days = Math.max(1, Math.floor((new Date(item.dateFin).getTime() - new Date(item.dateDebut).getTime()) / 86400000) + 1); return { id: item.id, userId: item.utilisateur.id, employeeName: `${item.utilisateur.prenom} ${item.utilisateur.nom}`, employeeEmail: item.utilisateur.email, type: item.typeDemande.libelle, startDate: item.dateDebut, endDate: item.dateFin, days, reason: item.motif, status: map[item.statut] ?? item.statut, managerComment: item.commentaireManager ?? '' }; }
}
