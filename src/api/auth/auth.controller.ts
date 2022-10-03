import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInInputDto } from './dto/signIn.input.dto';
import { LocalAuthGuard } from './local/local.guards';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: '로그인', description: '로그인 API 입니다.' })
  @ApiBody({ type: SignInInputDto })
  login(@Request() req) {
    return this.authService.login(req.user);
  }
}
