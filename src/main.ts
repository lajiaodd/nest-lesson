import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
declare const module: any;


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1')
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const httpAdapter = app.get(HttpAdapterHost)
  const logger = new Logger()
  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter))
  app.useGlobalPipes(new ValidationPipe({
    // 去除类上不存在的字段
    // whitelist: true
  }));

  await app.listen(3000);
  //热更新安装包 pnpm i --save-dev webpack-node-externals run-script-webpack-plugin webpack webpack-env
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
