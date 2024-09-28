import { Body, Controller, Delete, Get, Inject, LoggerService, Param, Patch, Post, Query, UseFilters, Headers, UnauthorizedException, UseGuards, ParseIntPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { getUserDto } from 'src/user/dto/get-user.dto';
import { TypeormFilter } from '../filters/typeorm.filter';
import { AuthGuard } from 'src/auth/auth.guard';
import { query } from 'express';
import { CreateUserPipe } from './pipes/create-user/create-user.pipe';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
@UseFilters(new TypeormFilter())
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ){}



    @Get()
    getUsers(@Query() query: getUserDto): any {
        console.log("🚀 ~ UserController ~ getUsers ~ query:", query)
        console.log(query.gender);
        
        this.logger.warn('hello')
        return this.userService.findAll(query)
    }

    @Post()
    addUsers(@Body(CreateUserPipe) dto: CreateUserDto): any {
        return this.userService.create(dto as User)
    }

    @Patch('/:id')
    updateUser(@Body() dto:any, @Param('id') id: number, @Headers('Authorization') Headers) {
        // 判断用户是否自己
        if(id == Headers) {
            // 判断用户是否有更新user的权限
            // 返回数据：不能包含敏感的password等信息
            return this.userService.update(id, dto)
        } else {
            throw new UnauthorizedException()
        }
    }

    @Delete('/:id')
    deleteUser(@Param("id") id:number) {
        // 判断用户是否有更新user的权限
        return this.userService.remove(id)
    }
    // 1.装饰器的执行顺序，从下往上执行
    // @UseGuards(AuthGuard)
    // @UseGuards(AuthGuard1)
    // 2.这种方式是从左往右执行，如果前面的Guard没有通过，则后面的Guard不会执行
    // @UseGuards(AuthGuard1， AuthGuard)
    @Get('/profile')
    findProfile(@Query('id', ParseIntPipe) id: number): any {
        console.log(typeof id);
        
        return this.userService.findProfile(id)
    }
    @Get('/logs')
    findLogs(): any {
        return this.userService.findUserLogs(1)
    }
    
    @Get('/logs_group')
    async findLogsByGroup(): Promise<any> {
        const results =await this.userService.findLogsByGroup(2)
        return results.map(result => ({
            result: result.result,
            count: result.count
        }))
    }

    @Get('/:id')
    getUser(@Param() id: number): any {
        return this.userService.findOne(id)
    }
}
