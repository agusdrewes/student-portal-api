import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { AcademicHistory } from '../../academic-history/entities/academic-history.entity';
import { Career } from '../../career/entities/career.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];

  @OneToMany(() => AcademicHistory, (h) => h.user)
  academicHistory: AcademicHistory[];


  @ManyToOne(() => Career, (career) => career.users, { nullable: true })
  career: Career;

}
