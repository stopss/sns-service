import { UserEntity } from 'src/api/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FeedsEntity } from './feed.entity';

@Entity({ name: 'likes' })
export class LikesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  feedId: number;

  @Column()
  userId: number;

  @Column({ default: false })
  isLike: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.like)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: UserEntity;

  @ManyToOne(() => FeedsEntity, (feed) => feed.like)
  @JoinColumn([{ name: 'feedId', referencedColumnName: 'id' }])
  feed: FeedsEntity;
}
