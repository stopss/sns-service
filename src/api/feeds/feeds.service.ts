import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedInputDto } from './dto/feed.input.dto';
import { FeedsEntity } from './entities/feed.entity';
import { LikesEntity } from './entities/like.entity';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(FeedsEntity)
    private readonly feedsRepository: Repository<FeedsEntity>,

    @InjectRepository(LikesEntity)
    private readonly likesRepository: Repository<LikesEntity>,
  ) {}

  async createFeed(feedInputDto: FeedInputDto, userName: string): Promise<any> {
    const { title, content, hashtags } = feedInputDto;

    const feed = this.feedsRepository.create({
      title,
      content,
      hashtags,
      writer: userName,
      viewCount: 0,
      likeCount: 0,
    });

    await this.feedsRepository.save(feed);

    return feed;
  }
}
