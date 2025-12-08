import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { DepositDto } from './dtos/account.dto';
import { ExternalJwtAuthGuard } from 'src/auth/external-jwt.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(ExternalJwtAuthGuard)
  @Get(':userId/balance')
  getBalance(@Param('userId') userId: string) {
    return this.accountService.getBalance(String(userId));
  }

  @UseGuards(ExternalJwtAuthGuard)
  @Post(':userId/transactions')
  deposit(@Param('userId') userId: string, @Body() dto: DepositDto) {
    return this.accountService.deposit(String(userId), dto);
  }
}
