import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'historiques' })
export class Historique {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ name: 'utilisateur_id', type: 'varchar', length: 50 })
  utilisateurId: string;

  @Column({ name: 'demande_id', type: 'varchar', length: 50, nullable: true })
  demandeId: string | null;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'varchar', length: 255 })
  details: string;

  @CreateDateColumn({ name: 'cree_le' })
  creeLe: Date;
}
