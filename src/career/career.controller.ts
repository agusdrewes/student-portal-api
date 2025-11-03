import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CareerService } from './career.service';

@Controller('careers')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  // GET /careers
  @Get()
  findAll() {
    return this.careerService.findAll();
  }

  // GET /careers/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.careerService.findOne(id);
  }

  // POST /careers
  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.careerService.create(body);
  }

  // POST /careers/:id/courses
  @Post(':id/courses')
  addCourse(@Param('id') careerId: string, @Body('courseId') courseId: string) {
    return this.careerService.addCourse(careerId, courseId);
  }
}
