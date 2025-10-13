import { IsInt } from 'class-validator';

export class CreateEnrollmentDto {
  @IsInt()
  userId: number;

  @IsInt()
  courseId: number;
}
