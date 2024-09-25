import { Body, Controller, Delete, Get, Inject, LoggerService, Param, Patch, Post, Query } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { getUserDto } from 'src/dto/get-user.dto';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ){}

    @Get('/:id')
    getUser(@Param() id: number): any {
        return this.userService.findOne(id)
    }

    @Get()
    getUsers(@Query() query: getUserDto): any {
        console.log("🚀 ~ UserController ~ getUsers ~ query:", query)
        console.log(query.gender);
        
        this.logger.warn('hello')
        return this.userService.getUser(query)
    }

    @Post()
    addUsers(@Body() dto: any): any {
        return this.userService.create(dto as User)
    }

    @Patch('/:id')
    updateUser(@Body() dto:any, @Param() id: number) {
        return this.userService.update(id, dto)
    }

    @Delete('/:id')
    deleteUser(@Param() id:number) {
        return this.userService.remove(id)
    }

    @Get('/profile')
    findProfile(): any {
        return this.userService.findProfile(2)
    }
    @Get('/logs')
    findLogs(): any {
        return this.userService.findUserLogs(2)
    }
    
    @Get('/logs_group')
    async findLogsByGroup(): Promise<any> {
        const results =await this.userService.findLogsByGroup(2)
        return results.map(result => ({
            result: result.result,
            count: result.count
        }))
    }
}
