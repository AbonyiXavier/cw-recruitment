import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TABLES } from '../../../common/constant';
import { BaseEntity } from '../../../common/base.entity';
import { User } from './user.entity';

@Entity(TABLES.photo)
export class Photo extends BaseEntity {
  @Column()
  Name: string;

  @Column()
  Url: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'User_Id' })
  User: User;
}
