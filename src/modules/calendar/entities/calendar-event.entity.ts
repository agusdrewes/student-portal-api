import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum EventType {
  Cafeteria = 'cafeteria',
  Exam = 'exam',
  Extracurricular = 'extracurricular',
  Sancion = 'sanción',
}

@Entity('calendar_events')
export class CalendarEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventId: string;

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

  @Column()
  userId?: string;

  @Column({ type: 'date' })
  date: string;
}
