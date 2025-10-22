import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepo: Repository<Purchase>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ✅ Crear una nueva compra
  async create(userId: number, dto: CreatePurchaseDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const purchase = this.purchaseRepo.create({
      user,
      product: dto.product,
      total: dto.total,
    });

    return this.purchaseRepo.save(purchase);
  }

  // ✅ Obtener todas las compras de un usuario
  async findByUser(userId: number) {
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
}
