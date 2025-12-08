import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { DepositDto } from './dtos/account.dto';
import { JwtDecodeGuard } from 'src/auth/jwt-decode.guard';
import { User } from 'src/auth/user.decorator';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtDecodeGuard)
  @Get(':userId/balance')
  getBalance(@Param('userId') userId: string) {
    return this.accountService.getBalance(String(userId));
  }

  @UseGuards(JwtDecodeGuard)
  @Post(':userId/transactions')
  deposit(@Param('userId') userId: string, @Body() dto: DepositDto) {
    return this.accountService.deposit(String(userId), dto);
  }

  @Get('wallet/sync')
    @UseGuards(JwtDecodeGuard)
    async syncStorePurchases(@User('sub') userUuid: string, @Req() req) {
      const token = req.headers.authorization?.split(' ')[1];
      return this.accountService.syncWallet(userUuid, token);
    }
   
}
