import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { User } from '../user/entities/user.entity';
import { DepositDto } from './dtos/account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getBalance(userId: number) {
    const account = await this.accountRepo.findOne({ where: { user: { id: userId } } });
    if (!account) throw new NotFoundException('Account not found');
    return { balance: account.balance.toFixed(2) };
  }

  async deposit(userId: number, dto: DepositDto) {
    const { amount } = dto;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let account = await this.accountRepo.findOne({ where: { user: { id: userId } } });
    if (!account) {
      account = this.accountRepo.create({ user, balance: 0 });
    }

    account.balance += parseFloat(amount);
    await this.accountRepo.save(account);

    return { balance: account.balance.toFixed(2) };
  }
}
