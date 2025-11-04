import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Commission } from '../../commission/entities/commission.entity';

@Entity('academic_history')
export class AcademicHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.academicHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Course, (course) => course.academicHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @ManyToOne(() => Commission, (commission) => commission.academicHistory, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'commissionId' })
  commission: Commission;

  @Column()
  semester: string;

  @Column()
  year: string;

  @Column({ type: 'varchar', nullable: true })
  finalNote: string | null;

  @Column({ default: 'in_progress' })
  status: 'in_progress' | 'passed' | 'failed';
}
