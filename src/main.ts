import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './api/common/swagger/setupSwagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
