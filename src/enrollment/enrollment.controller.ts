import { Controller, Get, Post, Body } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Enrollment } from './entities/enrollment.entity';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly service: EnrollmentService) {}

  @Get()
  findAll(): Promise<Enrollment[]> {
    return this.service.findAll();
  }

  @Post()
  enroll(@Body() dto: CreateEnrollmentDto): Promise<Enrollment> {
    return this.service.enroll(dto);
  }
}
