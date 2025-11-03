import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AccountService } from './account.service';
import { DepositDto } from './dtos/account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':userId/balance')
  getBalance(@Param('userId') userId: string) {
    return this.accountService.getBalance(String(userId));
  }

  @Post(':userId/deposit')
  deposit(@Param('userId') userId: string, @Body() dto: DepositDto) {
    return this.accountService.deposit(String(userId), dto);
  }
}
