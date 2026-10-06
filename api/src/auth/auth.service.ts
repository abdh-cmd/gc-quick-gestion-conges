import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { Structure, Utilisateur } from '../entities';
import { JwtPayload } from './jwt.strategy';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepository: Repository<Utilisateur>,
    @InjectRepository(Structure)
    private readonly structureRepository: Repository<Structure>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const [utilisateurExistant, structure] = await Promise.all([
      this.utilisateurRepository.findOneBy({ email }),
      this.structureRepository.findOneBy({ id: 'structure-gc' }),
    ]);

    if (utilisateurExistant) {
      throw new ConflictException('Cet e-mail est déjà utilisé.');
    }

    if (!structure) {
      throw new BadRequestException('La structure indiquée est introuvable.');
    }

    const utilisateur = this.utilisateurRepository.create({
      id: randomUUID(),
      nom: dto.nom.trim(),
      prenom: dto.prenom.trim(),
      email,
      motDePasseHash: await bcrypt.hash(dto.motDePasse, 12),
      matricule: `GC-${randomUUID().slice(0, 8).toUpperCase()}`,
      role: 'employee',
      structure,
    });
    await this.utilisateurRepository.save(utilisateur);

    return this.createAuthResponse(utilisateur);
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { email },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        matricule: true,
        role: true,
        motDePasseHash: true,
      },
    });

    if (
      !utilisateur ||
      !(await bcrypt.compare(dto.motDePasse, utilisateur.motDePasseHash))
    ) {
      throw new UnauthorizedException('E-mail ou mot de passe incorrect.');
    }

    return this.createAuthResponse(utilisateur);
  }

  async getProfile(id: string) {
    const utilisateur = await this.utilisateurRepository.findOne({
      where: { id },
      relations: { structure: true },
    });

    if (!utilisateur) {
      throw new UnauthorizedException('Utilisateur introuvable.');
    }

    return this.toPublicUser(utilisateur);
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const utilisateur = await this.utilisateurRepository.findOneBy({ id });
    if (!utilisateur) throw new UnauthorizedException('Utilisateur introuvable.');
    const email = dto.email.trim().toLowerCase();
    const existing = await this.utilisateurRepository.findOneBy({ email });
    if (existing && existing.id !== id) throw new ConflictException('Cet e-mail est déjà utilisé.');
    Object.assign(utilisateur, { nom: dto.nom.trim(), prenom: dto.prenom.trim(), email });
    return this.toPublicUser(await this.utilisateurRepository.save(utilisateur));
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const utilisateur = await this.utilisateurRepository.findOne({ where: { id }, select: { id: true, motDePasseHash: true } });
    if (!utilisateur || !(await bcrypt.compare(dto.currentPassword, utilisateur.motDePasseHash))) throw new UnauthorizedException('Mot de passe actuel incorrect.');
    utilisateur.motDePasseHash = await bcrypt.hash(dto.newPassword, 12);
    await this.utilisateurRepository.save(utilisateur);
    return { message: 'Mot de passe mis à jour.' };
  }

  private createAuthResponse(utilisateur: Utilisateur) {
    const payload: JwtPayload = {
      sub: utilisateur.id,
      email: utilisateur.email,
      role: utilisateur.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      tokenType: 'Bearer',
      utilisateur: this.toPublicUser(utilisateur),
    };
  }

  private toPublicUser(utilisateur: Utilisateur) {
    return {
      id: utilisateur.id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      matricule: utilisateur.matricule,
      role: utilisateur.role,
    };
  }
}
