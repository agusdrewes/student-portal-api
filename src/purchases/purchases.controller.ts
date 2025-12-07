import { Controller, Post, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { JwtDecodeGuard } from 'src/auth/jwt-decode.guard';
import { User } from 'src/auth/user.decorator';

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

  @UseGuards(JwtDecodeGuard)
  @Get()
  findAll(@Param('userId') userId: string) {
    return this.purchasesService.findByUser(userId);
  }
    @UseGuards(JwtDecodeGuard)
    @Get('transfers/sync')
    async syncTransfers(
      @User('sub') userUuid: string,
      @User('rawToken') token: string,

    ) {
      return this.purchasesService.syncTransfers(userUuid,token);
    }

    @Get('store/sync')
  @UseGuards(JwtDecodeGuard)
  async syncStorePurchases(@User('sub') userUuid: string, @Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.purchasesService.syncStorePurchases(userUuid, token);
  }



}
