import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Index,
  BeforeInsert,
} from 'typeorm';
import { randomUUID } from 'crypto';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  setId() {
    if (!this.id) this.id = randomUUID(); 
  }

  @Column({ type: 'varchar', length: 180 })
  name: string;

  @Index('idx_course_code', { unique: true })
  @Column({ type: 'varchar', length: 60, unique: true })
  code: string;

  @ManyToMany(() => Course, { cascade: false })
  @JoinTable({
    name: 'course_correlates',
    joinColumn: { name: 'course_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'correlate_id', referencedColumnName: 'id' },
  })
  correlates: Course[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
