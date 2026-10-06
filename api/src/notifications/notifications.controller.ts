import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.strategy';
import { NotificationsService } from './notifications.service';
type AuthRequest = Request & { user: JwtPayload };
@Controller('api/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}
  @Get() findAll(@Req() req: AuthRequest) { return this.service.findAll(req.user.sub); }
  @Patch(':id/read') markRead(@Param('id') id: string, @Req() req: AuthRequest) { return this.service.markRead(id, req.user.sub); }
}
