import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedsEntity } from './entities/feed.entity';
import { LikesEntity } from './entities/like.entity';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedsEntity, LikesEntity])],
  controllers: [FeedsController],
  providers: [FeedsService]
})
export class FeedsModule {}
