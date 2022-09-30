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
   * ID에 맞는 게시글 찾기
   * @param {number} feedId 게시글 id
   * @returns
   */
  async findFeedById(feedId: number) {
    const existFeed = await this.feedsRepository.findOne({
      where: { id: feedId },
    });

    // if (!existFeed) {
    //   throw new HttpException(
    //     {
    //       success: false,
    //       statusCode: HttpStatus.NOT_FOUND,
    //       error: '해당 게시글의 ID를 찾을 수 없습니다.',
    //       timestamp: new Date().toISOString(),
    //     },
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
    return existFeed;
  }

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
        statusCode: HttpStatus.CREATED,
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

  // 게시글 수정
  /**
   * 게시글 수정 API
   * @param {feedInputDto} feedInputDto title, content, hashtags @body로 수정된 값
   * @param {number} userId 사용자의 id
   * @param {number} feedId 게시글의 id
   * @returns 
   */
  async updateFeed(
    feedInputDto: FeedInputDto,
    userId: number,
    feedId: number,
  ): Promise<any> {
    try {
      const feed = await this.findFeedById(feedId);

      // 게시글 ID를 찾을 수 없는 경우
      if (!feed) {
        return Object.assign({
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          error: '해당 게시글의 ID를 찾을 수 없습니다.',
          timestamp: new Date().toISOString(),
        });
      }

      // 작성자만 게시글 수정이 가능
      if (feed.userId !== userId) {
        throw new HttpException(
          {
            success: false,
            statusCode: HttpStatus.FORBIDDEN,
            error: '게시글 수정 권한이 없습니다.',
            timestamp: new Date().toISOString(),
          },
          HttpStatus.FORBIDDEN,
        );
      }

      await this.feedsRepository.update({ id: feedId }, feedInputDto);

      const updateData = await this.feedsRepository.findOne({
        where: { id: feedId },
      });

      return Object.assign({
        success: true,
        statusCode: HttpStatus.OK,
        data: { updateData },
        message: '게시글이 수정되었습니다.',
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
