import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Utilisateur } from '../entities';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(@InjectRepository(Utilisateur) private readonly repository: Repository<Utilisateur>) {}

  @Get()
  async findAll() {
    const users = await this.repository.find({ order: { nom: 'ASC', prenom: 'ASC' } });
    return users.map(({ id, nom, prenom, email, role, matricule }) => ({ id, nom, prenom, firstName: prenom, lastName: nom, email, role, matricule }));
  }
}
