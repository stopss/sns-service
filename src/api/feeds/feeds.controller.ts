import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
}
