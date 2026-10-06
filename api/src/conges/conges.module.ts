import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Demande, TypeDemande, Utilisateur } from '../entities';
import { CongesController } from './conges.controller';
import { CongesService } from './conges.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { HistoriqueModule } from '../historique/historique.module';

@Module({
  imports: [TypeOrmModule.forFeature([Demande, TypeDemande, Utilisateur]), NotificationsModule, HistoriqueModule],
  controllers: [CongesController],
  providers: [CongesService],
})
export class CongesModule {}
