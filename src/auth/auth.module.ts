import { Module } from '@nestjs/common';
import { ExternalJwtAuthGuard } from './external-jwt.guard';

@Module({
  providers: [ExternalJwtAuthGuard],
  exports: [ExternalJwtAuthGuard],
})
export class AuthModule {}
