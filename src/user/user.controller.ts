import { Controller, Get} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
    ){}

    @Get()
    getUser(): any {
        console.log(this.configService.get(ConfigEnum.DB_DATABASE));
        console.log(this.configService.get("DB_URL"));
        console.log(process.env.NODE_ENV);
        
        return this.userService.getUser()
    }
}
