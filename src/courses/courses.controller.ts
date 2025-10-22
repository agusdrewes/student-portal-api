import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ============================================================
  // ✅ 1️⃣ Obtener todos los cursos del sistema (Admin)
  // ============================================================
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  // ============================================================
  // ✅ 2️⃣ Obtener los cursos disponibles para un usuario
  // Ejemplo: GET /courses/user?userId=1
  // ============================================================
  @Get('user')
  findCoursesForUser(@Query('userId') userId: number) {
    // ⚠️ Por ahora userId viene por query. En el futuro vendrá del JWT.
    if (!userId) userId = 1;
    return this.coursesService.findCoursesForUser(userId);
  }

  // ============================================================
  // ✅ 3️⃣ Obtener un curso específico
  // Ejemplo: GET /courses/1
  // ============================================================
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coursesService.findOne(id);
  }

  // ============================================================
  // ✅ 4️⃣ Crear un curso nuevo
  // ============================================================
  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }
}
