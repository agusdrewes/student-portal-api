import { Controller, Get, Post, Body } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './entities/course.entity';

@Controller('courses')
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Get()
  findAll(): Promise<Course[]> {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateCourseDto): Promise<Course> {
    return this.service.create(dto);
  }
}
