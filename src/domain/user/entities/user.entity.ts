import { Entity, Column } from 'typeorm';
import { TABLES } from '../../../common/constant';
import { BaseEntity } from '../../../common/base.entity';

@Entity(TABLES.user)
export class User extends BaseEntity {
  @Column({ length: 25 })
  FirstName: string;

  @Column({ length: 25 })
  LastName: string;

  @Column({ unique: true })
  Email: string;

  @Column({ length: 50 })
  Password: string;

  @Column()
  Role: string;

  @Column({ default: true })
  Active: boolean;
}
