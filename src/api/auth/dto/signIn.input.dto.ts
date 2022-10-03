import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInInputDto {
  @ApiProperty({
    example: 'test@email.com',
    description: '유저의 이메일',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: '1234',
    description: '유저의 비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
