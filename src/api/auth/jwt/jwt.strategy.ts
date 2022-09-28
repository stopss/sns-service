import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * @param jwtFromRequest 사용자 요청으로부터 JWT 추출
   * @param ignoreExpiration false(default)로, passport 모듈에 JWT 만료 검증 권한 위임 / true인 경우, passport에 토큰 권한 위임하지 않고 직접 검증
   * @param secretOrKey PEM 공개키로, 외부 노출 금지 (.env)
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
