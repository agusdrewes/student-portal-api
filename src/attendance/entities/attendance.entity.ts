import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Commission } from '../../commission/entities/commission.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.attendances, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Commission, (commission) => commission.attendances, {
    onDelete: 'CASCADE',
  })
  commission: Commission;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({ default: false })
  present: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
