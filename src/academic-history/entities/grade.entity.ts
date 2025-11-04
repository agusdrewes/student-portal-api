import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Enrollment, { onDelete: 'CASCADE' })
  enrollment: Enrollment;

  @Column({ nullable: true })
  semester: string; 

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
