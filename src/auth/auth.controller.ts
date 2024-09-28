import { Body, Controller, Post, HttpCode, HttpStatus, UseFilters, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';
import { SigninUserDto } from './dto/signin-user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { CreateUserDo } from 'src/user/do/create-user.do';
import { Serialize } from 'src/decorators/serialize.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SigninUserDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  // @UseInterceptors(new SerializeInterceptor(CreateUserDo))
  @Serialize(CreateUserDo)
  @Public()
  @Post('register')
  signUp(@Body() signInDto: SigninUserDto) {
    return this.authService.signUp(signInDto.username, signInDto.password);
  }
}
