import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Demande } from './demande.entity';
import { Structure } from './structure.entity';

@Entity({ name: 'utilisateurs' })
export class Utilisateur {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ name: 'nom', type: 'varchar', length: 50 })
  nom: string;

  @Column({ name: 'prenom', type: 'varchar', length: 50 })
  prenom: string;

  @Column({ name: 'email', type: 'varchar', length: 50, unique: true })
  email: string;

  // Valeur hashée uniquement : ne jamais persister un mot de passe en clair.
  @Column({ name: 'mdp', type: 'varchar', length: 255, select: false })
  motDePasseHash: string;

  @Column({ name: 'matricule', type: 'varchar', length: 50 })
  matricule: string;

  @Column({ name: 'role', type: 'varchar', length: 50 })
  role: string;

  @Column({ name: 'solde_conges', type: 'int', default: 25 })
  soldeConges: number;

  @ManyToOne(() => Structure, (structure) => structure.utilisateurs, {
    nullable: false,
  })
  @JoinColumn({ name: 'structure_id' })
  structure: Structure;

  @OneToMany(() => Demande, (demande) => demande.utilisateur)
  demandes: Demande[];
}
