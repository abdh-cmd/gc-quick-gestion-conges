import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDemandeDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsDateString()
  dateDebut: string;

  @IsDateString()
  dateFin: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  motif: string;
}
