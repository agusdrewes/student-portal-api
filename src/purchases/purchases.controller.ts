import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Controller('users/:userId/purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  create(
    @Param('userId') userId: string,
    @Body() dto: CreatePurchaseDto,
  ) {
    return this.purchasesService.create(userId, dto);
  }

  @Get()
  findAll(@Param('userId') userId: string) {
    return this.purchasesService.findByUser(userId);
  }
}
