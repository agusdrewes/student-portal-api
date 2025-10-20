import { IsNumber } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  courseId: number;

  @IsNumber()
  commissionId: number;
}
