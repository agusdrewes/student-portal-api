import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsISO8601,
  IsOptional,
  IsInt,
} from 'class-validator';
import { EventType } from '../entities/calendar-event.entity';

export class CreateCalendarEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsISO8601()
  startDateTime: string;

  @IsISO8601()
  endDateTime: string;

  @IsEnum(EventType)
  eventType: EventType;

  @IsISO8601()
  date: string;

  @IsOptional()
  @IsInt()
  userId?: number; // ID del usuario que crea el evento
}
