import { TypeOrmModuleOptions } from "@nestjs/typeorm";
// import { MyLogs } from "src/my_logs/my_logs.entity";
// import { Profile } from "src/profile/profile.entity";
// import { Roles } from "src/roles/roles.entity";
// import { User } from "src/user/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";
import * as fs from 'fs'
import * as dotenv from 'dotenv'
import { ConfigEnum } from "src/enum/config.enum";
// 通过环境变量读取不同的.env文件
function getEnv(env: string): Record<string, unknown> {
    if(fs.existsSync(env)) {
        return dotenv.parse(fs.readFileSync(env))
    }
}
// 通过dotenv来解析不同的配置
function buildConnectionOptions() {
    const defaultConfig = getEnv('.env')
    const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`)
    const config = {...defaultConfig, envConfig}

    const entitiesDir = process.env.NODE_ENV == 'test' 
        ? [__dirname + '/**/*.entity.ts']
        : [__dirname + '/**/*.entity{.js, .ts}']

    return {
        type: config[ConfigEnum.DB_TYPE],
        host: config[ConfigEnum.DB_HOST],
        port: config[ConfigEnum.DB_PORT],
        username: config[ConfigEnum.DB_USERNAME],
        password: config[ConfigEnum.DB_PASSWORD],
        database: config[ConfigEnum.DB_DATABASE],
        // entities: [User, Profile, MyLogs, Roles],
        entities: entitiesDir,
        synchronize: config[ConfigEnum.DB_SYNCHRONIZE], //同步本地的schema与数据库 -> 初始化的时候去使用
        // logging: ['error']
        // logging: process.env.NODE_ENV === 'development'
        logging: false

    } as TypeOrmModuleOptions
}

export const connectionParams =  buildConnectionOptions()

export default  new DataSource({...connectionParams, migrations: ['src/migrations/**'], subscribers: []} as DataSourceOptions)