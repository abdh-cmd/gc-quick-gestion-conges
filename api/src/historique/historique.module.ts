import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historique } from '../entities';
import { HistoriqueController } from './historique.controller';
import { HistoriqueService } from './historique.service';
@Module({ imports: [TypeOrmModule.forFeature([Historique])], controllers: [HistoriqueController], providers: [HistoriqueService], exports: [HistoriqueService] }) export class HistoriqueModule {}
