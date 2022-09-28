import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * 회원가입
   * @param userCreateDto
   * @returns
   */
  async createUser(userCreateDto: UserCreateDto): Promise<any> {
    const { email, name, password } = userCreateDto;

    try {
      // 비밀번호 암호호 형태로 저장
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const createdUser = this.userRepository.create({
        email,
        name,
        password: hashedPassword,
      });

      await this.userRepository.save(createdUser);

      return Object.assign({
        success: true,
        statusCode: 201,
        data: { createdUser },
        message: '새로운 유저가 등록되었습니다.',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // 중복 이메일인 경우 예외처리
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            success: false,
            statusCode: HttpStatus.BAD_REQUEST,
            error: '이미 존재하는 이메일입니다.',
            timestamp: new Date().toISOString(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '알 수 없는 오류가 발생했습니다.',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUserId(id: number) {
    try {
      const existUser = await this.userRepository.findOne({ where: { id } });

      if (!existUser) {
        throw new HttpException(
          {
            success: false,
            statusCode: HttpStatus.BAD_REQUEST,
            error: '해당 유저의 ID를 찾을 수 없습니다.',
            timestamp: new Date().toISOString(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return existUser;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '알 수 없는 오류가 발생했습니다.',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
