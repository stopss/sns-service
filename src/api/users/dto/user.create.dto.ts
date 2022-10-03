import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDto {
  @ApiProperty({ description: '유저 이메일', example: 'test@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '유저 이름', example: '홍길동' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '패스워드', example: '1234' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
