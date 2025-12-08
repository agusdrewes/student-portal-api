import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CalendarEvent, EventType } from './entities/calendar-event.entity';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { User } from '../user/entities/user.entity';
import axios from 'axios';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly calendarRepository: Repository<CalendarEvent>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(from?: string, to?: string, eventType?: string) {
    const query = this.calendarRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.user', 'user');

    if (from) query.andWhere('event.startDateTime >= :from', { from });
    if (to) query.andWhere('event.endDateTime <= :to', { to });
    if (eventType) query.andWhere('event.eventType = :eventType', { eventType });

    return query.getMany();
  }

  async findOne(id: string) {
    const event = await this.calendarRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async findByUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
  
    const events = await this.calendarRepository.find({
      where: [
        { user: { id: userId } }, 
        { user: IsNull() },           
      ],
      order: { date: 'ASC' },
      relations: ['user'],
    });
  
    if (!events.length)
      throw new NotFoundException('No events found for this user');
  
    return events;
  }
  

  async create(dto: CreateCalendarEventDto) {
    const event = this.calendarRepository.create(dto);

    if (dto.userId) {
      const user = await this.userRepository.findOneBy({ id: dto.userId });
      if (user) event.user = user;
    }

    return this.calendarRepository.save(event);
  }

  async update(id: string, dto: Partial<CreateCalendarEventDto>) {
    const event = await this.findOne(id);
    Object.assign(event, dto);
    return this.calendarRepository.save(event);
  }

  async cancel(id: string) {
    const event = await this.findOne(id);
    event.eventType = EventType.Cancelled;
    return this.calendarRepository.save(event);
  }

  async updateStatus(id: string, status: string) {
  const event = await this.calendarRepository.findOne({ where: { id } });
  if (!event) throw new NotFoundException('Event not found');

  event.eventStatus = status;
  return this.calendarRepository.save(event);
}
async syncFromAcademic(userUuid: string, token: string) {
  const url = 'https://eventos-academicos-service-1.onrender.com/api/events';
  console.log("TOKEN USADO PARA SYNC:", token);


  const response = await axios.get(url, {
    params: {
      endDate: "2030-12-30",
    },
    headers: {
      authorization: `Bearer ${token}`,
      userid: userUuid,
    }
  });

  const events = Array.isArray(response.data) ? response.data : [];

  console.log("🔥 Eventos recibidos:", events.length);

  if (events.length === 0) {
    return { success: true, inserted: 0, totalReceived: 0 };
  }

  const user = await this.userRepository.findOne({
    where: { id: userUuid }
  });

  if (!user) throw new NotFoundException("User not found");

  let inserted = 0;


console.log("🔥 Eventos recibidos:", events.length);

for (const ev of events) {

  console.log("RAW EVENT KEYS:", Object.keys(ev));
  console.log("ID QUE LLEGA:", ev.id);

  const exists = await this.calendarRepository.findOne({
    where: { id: ev.id }
  });

  if (exists) continue;

  const newEvent = this.calendarRepository.create({
    id: ev.id,  // ahora sí va a tener valor
    title: ev.name ?? "(Sin título)",
    description: ev.description ?? "",
    startDateTime: new Date(ev.startTime),
    endDateTime: new Date(ev.endTime),
    eventType: "GENERAL",
    sourceModule: "AcademicEvents",
    user,
    date: ev.startTime.substring(0, 10),
  });

  await this.calendarRepository.save(newEvent);
  inserted++;


  }

  return {
    success: true,
    inserted,
    totalReceived: events.length,
  };
}


}
