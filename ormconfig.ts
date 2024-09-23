import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { MyLogs } from "src/my_logs/my_logs.entity";
import { Profile } from "src/profile/profile.entity";
import { Roles } from "src/roles/roles.entity";
import { User } from "src/user/user.entity";

export default {
    type: 'mysql',
    host: 'localhost',
    port: 8800,
    username: 'root',
    password: 'root',
    database: 'test_db',
    entities: [User, Profile, MyLogs, Roles],
    synchronize: true, //同步本地的schema与数据库 -> 初始化的时候去使用
    logging: false
}  as TypeOrmModuleOptions