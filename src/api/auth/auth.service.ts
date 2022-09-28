import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    const validatePassword = await bcrypt.compare(password, user.password);

    // 이메일이나 비밀번호가 틀린 경우
    if (!user || validatePassword == false) {
      throw new HttpException(
        {
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          error: '이메일 혹은 비밀번호가 틀렸습니다.',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const { password, ...result } = user;
      return result;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, name: user.name };

    return Object.assign({
      success: true,
      statusCode: 200,
      data: { access_token: this.jwtService.sign(payload) },
      message: '로그인되었습니다. ',
      timestamp: new Date().toISOString(),
    });
  }
}
