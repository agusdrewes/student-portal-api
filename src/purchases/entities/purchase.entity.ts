import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  // 🧍 Relación con el usuario que hizo la compra
  @ManyToOne(() => User, (user) => user.purchases, { eager: true })
  user: User;

  // 🧾 Producto comprado (JSON embebido)
  @Column('jsonb')
  product: {
    name: string;
    description: string;
    productCode: string;
    subtotal: string; // con 2 decimales como string
    quantity: number;
  };

  // 🗓 Fecha de compra
  @CreateDateColumn()
  date: Date;

  // 💰 Total gastado
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: string;
}
