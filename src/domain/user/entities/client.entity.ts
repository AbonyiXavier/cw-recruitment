import { Entity, Column } from 'typeorm';
import { User } from './user.entity';
import { TABLES } from '../../../common/constant';

@Entity(TABLES.client)
export class Client extends User {
  @Column()
  Avatar: string;

  @Column('simple-array')
  Photos: string[];
}
