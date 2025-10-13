import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Commission } from '../../commission/entities/commission.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  // correlativas: lista de IDs de otros cursos
  @Column('int', { array: true, default: [] })
  correlates: number[];

  @OneToMany(() => Commission, (commission) => commission.course)
  commissions: Commission[];
}
