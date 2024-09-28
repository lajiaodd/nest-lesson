import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const request = context.switchToHttp().getRequest()
    // console.log('前置拦截：' request);
  
    return next.handle().pipe(
      map((data) => {
        // console.log('后置拦截：'+JSON.stringify(data));
        // return data
        return plainToInstance(this.dto, data, {
          // Expose就是设置哪些字段暴露， Exclude设置哪些字段不暴露
          excludeExtraneousValues: true
        })
      })
    )
  }
}
