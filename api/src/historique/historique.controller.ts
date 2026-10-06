import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { HistoriqueService } from './historique.service';
type AuthRequest = Request & { user: JwtPayload };
@Controller('api/historique') @UseGuards(JwtAuthGuard)
export class HistoriqueController { constructor(private readonly service: HistoriqueService) {} @Get() findAll(@Req() req: AuthRequest) { return this.service.findAll(req.user.sub); } }
