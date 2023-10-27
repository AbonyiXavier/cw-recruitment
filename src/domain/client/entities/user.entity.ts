import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { TABLES, UserRole } from '../../../common/constant';
import { BaseEntity } from '../../../common/base.entity';
import { Client } from './client.entity';

@Entity(TABLES.user)
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Client,
  })
  role: string;

  @Column({ default: true })
  active: boolean;

  @OneToOne(() => Client, (client) => client.user, {
    eager: true,
    cascade: true,
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;
}
