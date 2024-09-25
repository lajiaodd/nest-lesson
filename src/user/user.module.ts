import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { MyLogs } from 'src/my_logs/my_logs.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, MyLogs])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
