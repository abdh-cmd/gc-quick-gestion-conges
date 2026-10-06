import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Demande, Utilisateur } from '../entities';
import { SoldeController } from './solde.controller';
import { SoldeService } from './solde.service';
@Module({ imports: [TypeOrmModule.forFeature([Utilisateur, Demande])], controllers: [SoldeController], providers: [SoldeService] }) export class SoldeModule {}
