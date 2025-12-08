import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { User } from '../user/entities/user.entity';
import { DepositDto } from './dtos/account.dto';
import axios from 'axios';

@Injectable()
export class AccountService {
  
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getBalance(userId: string) {
    const account = await this.accountRepo.findOne({ where: { user: { id: userId } } });
    if (!account) throw new NotFoundException('Account not found');
    return { balance: account.balance.toFixed(2) };
  }

  async deposit(userId: string, dto: DepositDto) {
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

  async syncWallet(userUuid: string, token: string) {
    const user = await this.userRepo.findOne({ where: { id: userUuid } });
    if (!user) throw new NotFoundException('User not found');
  
    const response = await axios.get(
      'https://jtseq9puk0.execute-api.us-east-1.amazonaws.com/api/wallets/mine',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  
    const wallets = response.data?.data;
    if (!wallets || wallets.length === 0) {
      throw new NotFoundException('No wallet returned by CORE');
    }
  
    const coreBalance = parseFloat(wallets[0].balance); 
  
    let account = await this.accountRepo.findOne({
      where: { user: { id: user.id } },
    });
  
    if (!account) {
      account = this.accountRepo.create({
        user,
        balance: coreBalance,
      });
    } else {
      account.balance = coreBalance;
    }
  
    await this.accountRepo.save(account);
  
    return {
      success: true,
      balance: coreBalance.toFixed(2),
    };
  }
}
