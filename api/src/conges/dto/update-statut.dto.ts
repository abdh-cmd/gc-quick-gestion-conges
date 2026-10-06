import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateStatutDto {
  @IsIn(['pending', 'approved', 'rejected'])
  statut: 'pending' | 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  commentaireManager?: string;
}
