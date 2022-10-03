import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from './dto/user.create.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('api/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: '유저 회원가입',
    description: '유저 회원가입 API 입니다.',
  })
  register(@Body() userCreateDto: UserCreateDto): Promise<any> {
    return this.usersService.createUser(userCreateDto);
  }
}
