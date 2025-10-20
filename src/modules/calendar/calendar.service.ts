import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEvent } from './entities/calendar-event.entity';
import { CalendarEventDto } from './dto/create-calendar-event.dto';
@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly calendarRepository: Repository<CalendarEvent>,
  ) {}

  findAll(from?: string, to?: string, eventType?: string) {
    const query = this.calendarRepository.createQueryBuilder('event');

    if (from) query.andWhere('event.startDateTime >= :from', { from });
    if (to) query.andWhere('event.endDateTime <= :to', { to });
    if (eventType)
      query.andWhere('event.eventType = :eventType', { eventType });

    return query.getMany();
  }

  async findOne(id: number) {
    const event = await this.calendarRepository.findOne({
      where: { id },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(dto: CalendarEventDto) {
    const event = this.calendarRepository.create(dto);

    return this.calendarRepository.save(event);
  }

  async update(id: number, dto: Partial<CalendarEventDto>) {
    const event = await this.findOne(id);
    Object.assign(event, dto);
    return this.calendarRepository.save(event);
  }

  async delete(id: number) {
    const event = await this.findOne(id);
    await this.calendarRepository.remove(event);
    return { deleted: true };
  }
}
