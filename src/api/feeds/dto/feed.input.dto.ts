import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FeedInputDto {
  @ApiProperty({
    example: '맛집탐방',
    description: '게시글 제목',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'oo 식당 앞',
    description: '게시글 내용',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '#맛집, #서울',
    description: '게시글 해시태그',
    required: true,
  })
  @IsString()
  hashtags: string;
}
