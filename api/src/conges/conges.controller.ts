import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { CongesService } from './conges.service';
import { CreateDemandeDto } from './dto/create-demande.dto';
import { UpdateDemandeDto } from './dto/update-demande.dto';
import { UpdateStatutDto } from './dto/update-statut.dto';

type AuthRequest = Request & { user: JwtPayload };

@Controller('api/conges')
@UseGuards(JwtAuthGuard)
export class CongesController {
  constructor(private readonly congesService: CongesService) {}
  @Get() findAll(@Req() req: AuthRequest) { return this.congesService.findAll(req.user.sub, req.user.role); }
  @Get(':id') findOne(@Param('id') id: string, @Req() req: AuthRequest) { return this.congesService.findOne(id, req.user.sub, req.user.role); }
  @Post() create(@Body() dto: CreateDemandeDto, @Req() req: AuthRequest) { return this.congesService.create(dto, req.user.sub); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateDemandeDto, @Req() req: AuthRequest) { return this.congesService.update(id, dto, req.user.sub, req.user.role); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body() dto: UpdateStatutDto, @Req() req: AuthRequest) { return this.congesService.updateStatus(id, dto, req.user.sub, req.user.role); }
  @Delete(':id') remove(@Param('id') id: string, @Req() req: AuthRequest) { return this.congesService.remove(id, req.user.sub, req.user.role); }
}
