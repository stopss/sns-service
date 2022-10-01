import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import {
  FeedFindOptions,
  OrderOption,
  SortOption,
} from './dto/feed.find.options';
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
      const feed = await this.feedsRepository.findOne({
        where: { id: feedId },
      });

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
        return Object.assign({
          success: false,
          statusCode: HttpStatus.FORBIDDEN,
          error: '게시글 수정 권한이 없습니다.',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await this.feedsRepository.update(
        { id: feedId },
        feedInputDto,
      );

      const updateData = await this.feedsRepository.findOne({
        where: { id: feedId },
      });

      return Object.assign({
        success: result.affected ? true : false,
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

  /**
   * 게시글 삭제 API
   * @param {number} userId 사용자 id
   * @param {number} feedId 게시글 id
   * @returns
   */
  async deleteFeed(userId: number, feedId: number): Promise<any> {
    try {
      const feed = await this.feedsRepository.findOne({
        where: { id: feedId },
      });

      // 게시글 ID를 찾을 수 없는 경우
      if (!feed) {
        return Object.assign({
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          error: '해당 게시글의 ID를 찾을 수 없습니다.',
          timestamp: new Date().toISOString(),
        });
      }

      // 작성자만 게시글 삭제가 가능
      if (feed.userId !== userId) {
        return Object.assign({
          success: false,
          statusCode: HttpStatus.FORBIDDEN,
          error: '게시글 삭제 권한이 없습니다.',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await this.feedsRepository.softDelete({ id: feedId });

      return Object.assign({
        success: result.affected ? true : false,
        statusCode: HttpStatus.OK,
        message: '게시글이 삭제되었습니다.',
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

  /**
   * 게시글 복구 API
   * @param {number} userId 사용자 id
   * @param {number} feedId 게시글 id
   * @returns
   */
  async restoreFeed(userId: number, feedId: number): Promise<any> {
    try {
      const feed = await this.feedsRepository.findOne({
        where: { id: feedId },
        withDeleted: true,
      });

      if (!feed) {
        return Object.assign({
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          error: '해당 게시글의 ID를 찾을 수 없습니다.',
          timestamp: new Date().toISOString(),
        });
      }

      // 작성자만 게시글 복구가 가능
      if (feed.userId !== userId) {
        return Object.assign({
          success: false,
          statusCode: HttpStatus.FORBIDDEN,
          error: '게시글 복구 권한이 없습니다.',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await this.feedsRepository.restore({ id: feedId });

      return Object.assign({
        success: result.affected ? true : false,
        statusCode: HttpStatus.OK,
        message: '게시글이 복구되었습니다.',
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

  /**
   * 게시글 상세보기 API
   * @param {number} feedId 게시글 id
   * @returns
   */
  async detailFeed(feedId: number): Promise<any> {
    try {
      const feed = await this.feedsRepository.findOne({
        where: { id: feedId },
      });

      // 게시글 ID를 찾을 수 없는 경우
      if (!feed) {
        return Object.assign({
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          error: '해당 게시글의 ID를 찾을 수 없습니다.',
          timestamp: new Date().toISOString(),
        });
      }

      // 좋아요 수
      const [likeList, count] = await this.likesRepository.findAndCount({
        where: { feedId, isLike: true },
      });

      await this.feedsRepository.update(
        { id: feedId },
        { viewCount: feed.viewCount + 1, likeCount: count },
      );

      const result = await this.feedsRepository.findOne({
        where: { id: feedId },
      });

      return Object.assign({
        success: true,
        statusCode: HttpStatus.OK,
        data: { result },
        message: '게시글 보기가 완료되었습니다.',
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

  /**
   * 게시글 좋아요 API
   * @param {boolean} like 게시글 좋아요 true/false
   * @param {number} userId 사용자 id
   * @param {number} feedId 게시글 id
   * @returns
   */
  async likeFeed(userId: number, feedId: number): Promise<any> {
    try {
      const existLike = await this.likesRepository.findOne({
        where: { feedId, userId },
      });

      if (!existLike) {
        const data = this.likesRepository.create({
          feedId,
          userId,
          isLike: true,
        });

        await this.likesRepository.save(data);
      } else {
        if (existLike.isLike)
          await this.likesRepository.update(
            { id: existLike.id },
            { isLike: false },
          );
        else
          await this.likesRepository.update(
            { id: existLike.id },
            { isLike: true },
          );
      }

      const data = await this.likesRepository.findOne({
        where: { feedId, userId },
      });

      return Object.assign({
        success: true,
        statusCode: HttpStatus.OK,
        data: { like: data.isLike },
        message: `좋아요 값이 ${data.isLike}입니다.`,
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

  // 게시글 전체 목록
  async findList({ ...feedFindOptions }: FeedFindOptions): Promise<any> {
    let { order, sort, page, pageCount } = feedFindOptions;
    const { search, filter } = feedFindOptions;

    const db = this.feedsRepository.createQueryBuilder('feed');

    // default 값
    order = order || OrderOption.DESC;
    sort = sort || SortOption.CREATEDAT;
    page = page || 1;
    pageCount = pageCount || 10;

    if (search) {
      db.andWhere(
        new Brackets((db) => {
          db.orWhere(`feed.title like '%${search}%'`);
          db.orWhere(`feed.content like '%${search}%'`);
        }),
      );
    }

    if (filter) {
      const hashTags = filter.split(',').map((el) => {
        return '#' + el;
      });
      db.andWhere(
        new Brackets((qb) => {
          hashTags.forEach((el) => {
            qb.andWhere(`feed.hashTags like '%${el}%'`);
          });
        }),
      );
    }

    const feedList = await db
      .orderBy(`feed.${sort}`, order)
      .take(pageCount)
      .skip((page - 1) * pageCount)
      .getMany();

    return feedList;
  }
}
