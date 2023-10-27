import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TABLES } from '../../../common/constant';
import { BaseEntity } from '../../../common/base.entity';
import { User } from './user.entity';

@Entity(TABLES.photo)
export class Photo extends BaseEntity {
  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
