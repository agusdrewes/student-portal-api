import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCommissionDto {
  @IsString()
  days: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsString()
  shift: 'morning' | 'afternoon' | 'night';

  @IsString()
  classRoom: string;

  @IsString()
  professorName: string;

  @IsNumber()
  availableSpots: number;

  @IsNumber()
  totalSpots: number;

  @IsString()
  mode: 'virtual' | 'in person';

  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
