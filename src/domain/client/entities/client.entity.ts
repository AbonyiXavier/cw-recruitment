import { Entity, Column, OneToOne } from 'typeorm';
import { TABLES } from '../../../common/constant';
import { User } from './user.entity';
import { BaseEntity } from '../../../common/base.entity';

@Entity(TABLES.client)
export class Client extends BaseEntity {
  @Column({
    default: 'https://good-deed-app.s3-us-west-1.amazonaws.com/user.png',
  })
  avatar: string;

  @Column('text', { array: true })
  photos: string[];

  @OneToOne(() => User, (user) => user.client)
  user: User;
}
