import { IsNotEmpty, IsString } from 'class-validator';

export class FeedInputDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  hashtags: string;
}
