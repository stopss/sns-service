import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guards';
import { FeedInputDto } from './dto/feed.input.dto';
import { FeedsService } from './feeds.service';

@Controller('api/feed')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() feedInputDto: FeedInputDto, @Req() req): Promise<any> {
    const userId = req.user.userId;
    const userName = req.user.username;
    return this.feedsService.createFeed(feedInputDto, userId, userName);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
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
  delete(@Req() req, @Param('id') id: number): Promise<any> {
    const userId = req.user.userId;
    return this.feedsService.deleteFeed(userId, id);
  }
}
