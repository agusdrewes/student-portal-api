import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { AcademicHistory } from '../../academic-history/entities/academic-history.entity';

@Entity('commissions')
export class Commission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  days: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  shift: 'morning' | 'afternoon' | 'night';

  @Column()
  classRoom: string;

  @Column()
  professorName: string;

  @Column()
  availableSpots: number;

  @Column()
  totalSpots: number;

  @Column()
  mode: 'virtual' | 'in person';

  @Column('decimal', { precision: 10, scale: 2 })
  price: string;

  @ManyToOne(() => Course, (course) => course.commissions, { onDelete: 'CASCADE' })
  course: Course;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.commission)
  enrollments: Enrollment[];

  @OneToMany(() => AcademicHistory, (h) => h.commission)
  academicHistory: AcademicHistory[];
}
