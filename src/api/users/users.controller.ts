import { Body, Controller, Post } from '@nestjs/common';
import { UserCreateDto } from './dto/user.create.dto';
import { UsersService } from './users.service';

@Controller('api/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  register(@Body() userCreateDto: UserCreateDto): Promise<any> {
    return this.usersService.createUser(userCreateDto);
  }
}
