import { UserEntity } from 'src/api/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LikesEntity } from './like.entity';

@Entity({ name: 'feeds' })
export class FeedsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  hashtags: string;

  @Column()
  writer: string;

  @Column()
  viewCount: number;

  @Column()
  likeCount: number;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.feed)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: UserEntity;

  @OneToMany(() => LikesEntity, (like) => like.feedId)
  like: LikesEntity[];
}
