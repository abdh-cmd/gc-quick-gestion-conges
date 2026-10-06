import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { Historique } from '../entities';
@Injectable()
export class HistoriqueService {
  constructor(@InjectRepository(Historique) private readonly repository: Repository<Historique>) {}
  log(utilisateurId: string, action: string, details: string, demandeId: string | null = null) { return this.repository.save(this.repository.create({ id: randomUUID(), utilisateurId, action, details, demandeId })); }
  findAll(utilisateurId: string) { return this.repository.find({ where: { utilisateurId }, order: { creeLe: 'DESC' }, take: 50 }); }
}
