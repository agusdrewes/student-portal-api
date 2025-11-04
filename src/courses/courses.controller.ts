import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtDecodeGuard } from 'src/auth/jwt-decode.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('user')
  findCoursesForUser(@Query('userId') userId: string) {
    return this.coursesService.findCoursesForUser(userId);
  }

  @UseGuards(JwtDecodeGuard)
  @Get('available')
  findAvailableCourses(@Query('userId') userId: string) {
    return this.coursesService.findAvailableCoursesForUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }
}
