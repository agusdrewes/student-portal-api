import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsISO8601,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRole {
  Student = 'student',
  Professor = 'professor',
}

export class EventCreatedUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export enum EventType {
  Cafeteria = 'cafeteria',
  Exam = 'exam',
  Extracurricular = 'extracurricular',
  Sancion = 'sanción',
}

export class CalendarEventDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsISO8601()
  startDateTime: string;

  @IsISO8601()
  endDateTime: string;

  @IsEnum(EventType)
  eventType: EventType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested()
  @Type(() => EventCreatedUserDto)
  user: EventCreatedUserDto;

  @IsISO8601()
  date: string;
}
