import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Demande } from './demande.entity';

@Entity({ name: 'types_demande' })
export class TypeDemande {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ name: 'libelle', type: 'varchar', length: 50 })
  libelle: string;

  @OneToMany(() => Demande, (demande) => demande.typeDemande)
  demandes: Demande[];
}
