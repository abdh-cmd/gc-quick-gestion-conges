import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CongesModule } from './conges/conges.module';
import { UsersModule } from './users/users.module';
import { Demande, Historique, Notification, Structure, TypeDemande, Utilisateur } from './entities';
import { NotificationsModule } from './notifications/notifications.module';
import { HistoriqueModule } from './historique/historique.module';
import { SoldeModule } from './solde/solde.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST ?? '127.0.0.1',
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'tempolis',
      entities: [Structure, Utilisateur, Demande, TypeDemande, Notification, Historique],
      // À désactiver en production et à remplacer par des migrations.
      synchronize: process.env.DB_SYNCHRONIZE !== 'false',
    }),
    AuthModule,
    CongesModule,
    UsersModule,
    NotificationsModule,
    HistoriqueModule,
    SoldeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
