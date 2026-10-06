import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class UpdateProfileDto { @IsString() @IsNotEmpty() @MaxLength(50) nom: string; @IsString() @IsNotEmpty() @MaxLength(50) prenom: string; @IsEmail() @MaxLength(50) email: string; }
