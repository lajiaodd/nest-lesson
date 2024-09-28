import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { MyLogs } from 'src/my_logs/my_logs.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UserModule,
    // TypeOrmModule.forFeature([User, MyLogs]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      // secretOrPrivateKey: jwtConstants.secret,
      signOptions: { expiresIn: '3d' },
    }),
  ],
  providers: [AuthService,    {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}


