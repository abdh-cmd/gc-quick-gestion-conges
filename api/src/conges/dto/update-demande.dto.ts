import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateDemandeDto {
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
