import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Utilisateur } from './utilisateur.entity';

@Entity({ name: 'structures' })
export class Structure {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ name: 'matricule', type: 'varchar', length: 50 })
  matricule: string;

  @Column({ name: 'adresse', type: 'varchar', length: 50 })
  adresse: string;

  @OneToMany(() => Utilisateur, (utilisateur) => utilisateur.structure)
  utilisateurs: Utilisateur[];
}
