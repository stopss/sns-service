import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt.guards';
import {
  FeedFindOptions,
  OrderOption,
  SortOption,
} from './dto/feed.find.options';
import { FeedInputDto } from './dto/feed.input.dto';
import { FeedsService } from './feeds.service';

@ApiTags('Feed')
@Controller('api/feed')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: '게시글 생성',
    description: '게시글 생성 API 입니다.',
  })
  @ApiBearerAuth('access_token')
  create(@Body() feedInputDto: FeedInputDto, @Req() req): Promise<any> {
    const userId = req.user.userId;
    const userName = req.user.username;
    return this.feedsService.createFeed(feedInputDto, userId, userName);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({
    summary: '게시글 수정',
    description: '게시글 수정 API 입니다.',
  })
  @ApiBearerAuth('access_token')
  update(
    @Body() feedInputDto: FeedInputDto,
    @Req() req,
    @Param('id') id: number,
  ): Promise<any> {
    const userId = req.user.userId;

    return this.feedsService.updateFeed(feedInputDto, userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({
    summary: '게시글 삭제',
    description: '게시글 삭제 API 입니다.',
  })
  @ApiBearerAuth('access_token')
  delete(@Req() req, @Param('id') id: number): Promise<any> {
    const userId = req.user.userId;
    return this.feedsService.deleteFeed(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({
    summary: '게시글 복구',
    description: '게시글 복구 API 입니다.',
  })
  @ApiBearerAuth('access_token')
  restore(@Req() req, @Param('id') id: number): Promise<any> {
    const userId = req.user.userId;
    return this.feedsService.restoreFeed(userId, id);
  }

  @Get(':id')
  @ApiOperation({
    summary: '게시글 상세',
    description: '게시글 상세보기 API 입니다.',
  })
  @ApiBearerAuth('access_token')
  detail(@Param('id') id: number): Promise<any> {
    return this.feedsService.detailFeed(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/like')
  @ApiOperation({
    summary: '게시글 좋아요',
    description: '게시글 좋아요 API 입니다.',
  })
  @ApiBearerAuth('access_token')
  like(@Param('id') id: number, @Req() req): Promise<any> {
    const userId = req.user.userId;
    return this.feedsService.likeFeed(userId, id);
  }

  @Get()
  @ApiOperation({
    summary: '게시글 전체목록',
    description: '게시글 전체목록 API 입니다.',
  })
  @ApiBearerAuth('access_token')
  findList(
    @Query('search') search?: string,
    @Query('order') order?: OrderOption,
    @Query('sort') sort?: SortOption,
    @Query('filter') filter?: string,
    @Query('page') page?: number,
    @Query('pageCount') pageCount?: number,
  ): Promise<any> {
    const feedFindOptions: FeedFindOptions = {
      search,
      order,
      sort,
      filter,
      page,
      pageCount,
    };

    return this.feedsService.findList({ ...feedFindOptions });
  }
}
