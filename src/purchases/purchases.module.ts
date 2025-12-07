import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { Purchase } from './entities/purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Purchase, User])],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
