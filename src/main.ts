import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar CORS (para permitir peticiones desde tu frontend)
  app.enableCors({
    origin: 'http://localhost:3002', // 👈 dominio del front
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // necesario si usás cookies o headers de autenticación
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT || 3000);
  console.log('🚀 Servidor corriendo en http://localhost:3000');
  console.log('✅ CORS habilitado para http://localhost:3002');
}
bootstrap();
