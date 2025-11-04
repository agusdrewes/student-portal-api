import { Module } from '@nestjs/common';
import { JwtDecodeGuard } from './jwt-decode.guard';

@Module({
  providers: [JwtDecodeGuard],
  exports: [JwtDecodeGuard],
})
export class AuthModule {}
