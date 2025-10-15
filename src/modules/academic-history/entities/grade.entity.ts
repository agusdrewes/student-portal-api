import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Enrollment, { onDelete: 'CASCADE' })
  enrollment: Enrollment;

  @Column({ nullable: true })
  semester: string; // '1C' o '2C'

  @Column({ nullable: true })
  year: string;

  @Column('decimal', { precision: 4, scale: 2, nullable: true })
  finalNote: number;

  @Column({
    type: 'enum',
    enum: ['passed', 'failed'],
    default: 'failed',
  })
  status: 'passed' | 'failed';
}
