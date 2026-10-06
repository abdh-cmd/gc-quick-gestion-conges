import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { SoldeService } from './solde.service';
type AuthRequest = Request & { user: JwtPayload };
@Controller('api/solde') @UseGuards(JwtAuthGuard)
export class SoldeController { constructor(private readonly service: SoldeService) {} @Get() get(@Req() req: AuthRequest) { return this.service.getForUser(req.user.sub); } }
