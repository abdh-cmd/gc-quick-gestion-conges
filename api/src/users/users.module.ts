import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utilisateur } from '../entities';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Utilisateur])],
  controllers: [UsersController],
})
export class UsersModule {}
