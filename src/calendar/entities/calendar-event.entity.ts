import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum EventType {
  Cafeteria = 'cafeteria',
  Exam = 'exam',
  Extracurricular = 'extracurricular',
  Sancion = 'sanción',
}

@Entity('calendar_events')
export class CalendarEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  startDateTime: Date;

  @Column({ type: 'timestamp' })
  endDateTime: Date;

  @Column({ type: 'enum', enum: EventType })
  eventType: EventType;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  user?: User;

  @Column({ type: 'date' })
  date: string;
}
