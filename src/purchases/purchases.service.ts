import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { User } from '../user/entities/user.entity';
import axios from 'axios';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepo: Repository<Purchase>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async create(userId: string, dto: CreatePurchaseDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const purchase = this.purchaseRepo.create({
      user,
      product: dto.product,
      total: dto.total,
    });

    return this.purchaseRepo.save(purchase);
  }

  async findByUser(userId: string) {
    const purchases = await this.purchaseRepo.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });

    if (!purchases.length) {
      throw new NotFoundException('No purchases found for this user');
    }

    return purchases.map((p) => ({
      id: p.id,
      product: p.product,
      date: p.date,
      total: p.total,
    }));
  }
  async syncTransfers(userUuid: string, token: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userUuid } });
  
      if (!user) throw new Error('Usuario no encontrado');
  
      // 2️⃣ Hacer la llamada a CORE
      const response = await axios.get(
        'https://jtseq9puk0.execute-api.us-east-1.amazonaws.com/api/transfers/mine',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
  
      const transfers = response.data.data;
  
      const saved: Purchase[] = [];

      for (const t of transfers) {
        const purchase = this.purchaseRepo.create({
          user,
          product: {
            name: t.description,
            description: 'Transferencia CORE',
            productCode: t.to_wallet_uuid,
            subtotal: t.amount,
            quantity: 1,
          },
          total: t.amount,
        });

        const inserted = await this.purchaseRepo.save(purchase);
        saved.push(inserted); // ✔ ahora sí funciona
      }

  
      return saved;
  
    } catch (err) {
      console.error(err);
      throw new Error('Error al sincronizar transferencias');
    }
  }
  
}
