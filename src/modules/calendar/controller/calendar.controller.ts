import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CalendarEventDto, EventType } from './dto/calendar-event.dto';

const events: CalendarEventDto[] = [];

@Controller('calendar')
export class CalendarController {
  @Get()
  get(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('eventType') eventType?: EventType,
  ): CalendarEventDto[] {
    let filtered = events;
    if (from) filtered = filtered.filter((e) => e.startDateTime >= from);
    if (to) filtered = filtered.filter((e) => e.endDateTime <= to);
    if (eventType) filtered = filtered.filter((e) => e.eventType === eventType);
    return filtered;
  }

  @Get('events/:id')
  getEvent(@Param('id') id: string): CalendarEventDto {
    const event = events.find((e) => e.id === id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  @Post('events')
  createEvent(@Body() body: CalendarEventDto): CalendarEventDto {
    events.push(body);
    return body;
  }

  @Put('events/:id')
  updateEvent(
    @Param('id') id: string,
    @Body() body: Partial<Omit<CalendarEventDto, 'id'>>,
  ): CalendarEventDto {
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) throw new NotFoundException('Event not found');
    events[idx] = { ...events[idx], ...body };
    return events[idx];
  }

  @Delete('events/:id')
  deleteEvent(@Param('id') id: string): { deleted: boolean } {
    const idx = events.findIndex((e) => e.id === id);
    if (idx === -1) throw new NotFoundException('Event not found');
    events.splice(idx, 1);
    return { deleted: true };
  }
}
