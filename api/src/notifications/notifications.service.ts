import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { Notification } from '../entities';

@Injectable()
export class NotificationsService {
  constructor(@InjectRepository(Notification) private readonly repository: Repository<Notification>) {}

  create(utilisateurId: string, message: string) {
    return this.repository.save(this.repository.create({ id: randomUUID(), utilisateurId, message, lu: false }));
  }
  findAll(utilisateurId: string) { return this.repository.find({ where: { utilisateurId }, order: { creeLe: 'DESC' } }); }
  async markRead(id: string, utilisateurId: string) {
    await this.repository.update({ id, utilisateurId }, { lu: true });
    return { message: 'Notification lue.' };
  }
}
