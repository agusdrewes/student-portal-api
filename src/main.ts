import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(">>> INICIANDO SERVIDOR NEST <<<");

  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar CORS (para permitir peticiones desde tu frontend)
  app.enableCors({
    origin: [
      "http://localhost:3002",
      "https://student-portal-front-production.up.railway.app",
    ],    
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

  console.log(">>> A PUNTO DE LLAMAR app.listen(...) <<<", process.env.PORT);

  await app.listen(Number(process.env.PORT) || 3000);
  console.log('🚀 Servidor corriendo en http://localhost:3000');
  console.log('✅ CORS habilitado para http://localhost:3002');
}
bootstrap();
