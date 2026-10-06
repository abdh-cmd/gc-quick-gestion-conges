import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtPayload } from './jwt.strategy';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

type AuthenticatedRequest = Request & { user: JwtPayload };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() request: AuthenticatedRequest) {
    return this.authService.getProfile(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Body() dto: UpdateProfileDto, @Req() request: AuthenticatedRequest) { return this.authService.updateProfile(request.user.sub, dto); }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  updatePassword(@Body() dto: UpdatePasswordDto, @Req() request: AuthenticatedRequest) { return this.authService.updatePassword(request.user.sub, dto); }
}
