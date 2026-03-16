import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './bootstraps/swagger';
import { appConfig } from './config/app.config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: false,
        forbidNonWhitelisted: false,
        skipMissingProperties: true,
      }),
    );
  app.enableCors();
  await app.listen(appConfig.port);
  console.log('Nest running on port', appConfig.port);
}
bootstrap();
