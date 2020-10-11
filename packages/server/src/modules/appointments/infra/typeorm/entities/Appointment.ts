import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

// tsconfig.json
// Linhas 62 e 63 descomentadas
// Linha 33 descomentada e alterada para falso

import User from '@modules/users/infra/typeorm/entities/User';

/** Tipos de relacionamentos
 * Um para um         (OneToOne)
 * Um para muitos     (OneToMany)
 * Muitos para muitos (ManyToMany)
 */

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider_id: string;

  @ManyToOne(() => User) // MUITOS agendamentos para UM prestador
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column()
  user_id: string;

  @ManyToOne(() => User) // MUITOS agendamentos feitos por UM usuário
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
};

export default Appointment;