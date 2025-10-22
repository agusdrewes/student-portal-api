import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('careers')
export class Career {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  // Relación con usuarios
  @OneToMany(() => User, (user) => user.career)
  users: User[];

  // Relación con cursos
  @OneToMany(() => Course, (course) => course.career)
  courses: Course[];
}
