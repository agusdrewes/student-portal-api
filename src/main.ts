import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ habilita el uso de DTOs con validación automática
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina campos no declarados en el DTO
      forbidNonWhitelisted: true, // lanza error si llega un campo desconocido
      transform: true, // convierte tipos automáticamente
    }),
  );

  await app.listen(3000);
}
bootstrap();
