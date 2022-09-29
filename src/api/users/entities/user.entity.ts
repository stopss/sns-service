import { FeedsEntity } from 'src/api/feeds/entities/feed.entity';
import { LikesEntity } from 'src/api/feeds/entities/like.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @OneToMany(() => FeedsEntity, (feed) => feed.writer)
  feed: FeedsEntity[];

  @OneToMany(() => LikesEntity, (like) => like.userId)
  like: LikesEntity[];
}
