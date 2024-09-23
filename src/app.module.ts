import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { User } from './user/user.entity';
import { Profile } from './profile/profile.entity';
import { MyLogs } from './my_logs/my_logs.entity';
import { Roles } from './roles/roles.entity';


const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({path: './.env'})], // 安装@nestjs/config和dotenv

    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get(ConfigEnum.DB_TYPE),
        host: configService.get(ConfigEnum.DB_HOST),
        port: configService.get(ConfigEnum.DB_PORT),
        username: configService.get(ConfigEnum.DB_USERNAME),
        password: configService.get(ConfigEnum.DB_PASSWORD),
        database: configService.get(ConfigEnum.DB_DATABASE),
        entities: [User, Profile, MyLogs, Roles],
        synchronize: configService.get(ConfigEnum.DB_SYNCHRONIZE), //同步本地的schema与数据库 -> 初始化的时候去使用
        // logging: ['error']
        // logging: process.env.NODE_ENV === 'development'
      } as TypeOrmModuleOptions),
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 8800,
    //   username: 'root',
    //   password: 'root',
    //   database: 'test_db',
    //   entities: [User],
    //   synchronize: true, //同步本地的schema与数据库 -> 初始化的时候去使用
    //   logging: ['error']
    // }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
