import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { TypeDemande } from './type-demande.entity';
import { Utilisateur } from './utilisateur.entity';

@Entity({ name: 'demandes' })
export class Demande {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ name: 'date_debut', type: 'date' })
  dateDebut: string;

  @Column({ name: 'date_fin', type: 'date' })
  dateFin: string;

  @Column({ name: 'motif', type: 'text' })
  motif: string;

  @Column({ name: 'statut', type: 'varchar', length: 50 })
  statut: string;

  @Column({ name: 'commentaire_manager', type: 'text', default: '' })
  commentaireManager: string;

  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.demandes, {
    nullable: false,
  })
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: Utilisateur;

  @ManyToOne(() => TypeDemande, (typeDemande) => typeDemande.demandes, {
    nullable: false,
  })
  @JoinColumn({ name: 'type_demande_id' })
  typeDemande: TypeDemande;
}
