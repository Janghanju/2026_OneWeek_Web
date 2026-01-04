import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001, '0.0.0.0'); // Backend port
}
bootstrap();
