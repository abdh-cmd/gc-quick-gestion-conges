import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ name: 'utilisateur_id', type: 'varchar', length: 50 })
  utilisateurId: string;

  @Column({ type: 'varchar', length: 255 })
  message: string;

  @Column({ name: 'lu', type: 'boolean', default: false })
  lu: boolean;

  @CreateDateColumn({ name: 'cree_le' })
  creeLe: Date;
}
