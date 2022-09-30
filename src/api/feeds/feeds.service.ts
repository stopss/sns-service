import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  /**
   * 게시글 생성 API
   * @param {feedInputDto} feedInputDto  title, content, hashtags @body로 입력된 값
   * @param {number} userId  사용자의 id
   * @param {string} writer 사용자 이름
   * @returns
   */
  async createFeed(
    feedInputDto: FeedInputDto,
    userId: number,
    writer: string,
  ): Promise<any> {
    const { title, content, hashtags } = feedInputDto;

    try {
      const feed = this.feedsRepository.create({
        userId,
        title,
        content,
        hashtags,
        writer,
        viewCount: 0,
        likeCount: 0,
      });

      await this.feedsRepository.save(feed);

      return Object.assign({
        success: true,
        statusCode: 201,
        data: { feed },
        message: '게시글이 등록되었습니다.',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '알 수 없는 오류가 발생했습니다.',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
