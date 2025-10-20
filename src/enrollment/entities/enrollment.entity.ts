import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { Commission } from '../../commission/entities/commission.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.enrollments, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Course, (course) => course.enrollments, { eager: false })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @ManyToOne(() => Commission, (commission) => commission.enrollments, {
    eager: false,
  })
  @JoinColumn({ name: 'commissionId' })
  commission: Commission;

  
}
