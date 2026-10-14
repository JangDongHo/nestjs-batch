import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // TODO: 배치 실행 로직 작성
  } finally {
    await app.close();
  }
}
bootstrap();
