import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
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

    @ManyToMany(() => Course, (course) => course.careers, { cascade: true })
    @JoinTable({
        name: 'career_courses', // tabla intermedia
        joinColumn: { name: 'career_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'course_id', referencedColumnName: 'id' },
    })
    courses: Course[];
}
