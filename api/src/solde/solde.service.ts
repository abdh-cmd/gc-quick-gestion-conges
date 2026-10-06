import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Demande, Utilisateur } from '../entities';
@Injectable()
export class SoldeService {
  constructor(@InjectRepository(Utilisateur) private readonly users: Repository<Utilisateur>, @InjectRepository(Demande) private readonly demandes: Repository<Demande>) {}
  async getForUser(utilisateurId: string) {
    const user = await this.users.findOneBy({ id: utilisateurId });
    const approved = await this.demandes.find({ where: { utilisateur: { id: utilisateurId } }, relations: { utilisateur: true } });
    const used = approved.filter((d) => d.statut === 'validee').reduce((sum, d) => sum + Math.max(1, Math.floor((new Date(d.dateFin).getTime() - new Date(d.dateDebut).getTime()) / 86400000) + 1), 0);
    const total = user?.soldeConges ?? 25;
    return { total, used, remaining: Math.max(0, total - used) };
  }
}
