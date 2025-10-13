import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;
}
