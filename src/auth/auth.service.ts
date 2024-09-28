import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { User } from 'src/user/user.entity';
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userService.find(username);

    if(!user) {
      throw new ForbiddenException('用户不存在')
    }

    if( !(await argon2.verify(user.password, pass))) {
      throw new ForbiddenException('用户名或者密码错误')
    }
    // TODO: 生成一个 JWT，并在这里返回
    // 而不是返回一个用户对象
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload, {secret: jwtConstants.secret}),
    };
  }

  async signUp(username: string, password: string): Promise<any> {
    const user = await this.userService.find(username);
    if (user?.username == username) {
      throw new ForbiddenException('用户已存在');
    }
    // TODO: 生成一个 JWT，并在这里返回
    // 而不是返回一个用户对象
    return this.userService.create({username, password} as User)
  }
}

