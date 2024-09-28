import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { MyLogs } from 'src/my_logs/my_logs.entity';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '../roles/roles.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, MyLogs, Roles])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
