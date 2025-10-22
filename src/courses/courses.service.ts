import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ============================================================
  // ✅ 1️⃣ Obtener todos los cursos
  // ============================================================
  async findAll() {
    const courses = await this.courseRepo.find({
      relations: ['commissions', 'career'],
    });

    if (!courses.length) {
      throw new NotFoundException('No courses found');
    }

    return courses.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      description: c.description,
      career: c.career ? c.career.name : null,
      totalCommissions: c.commissions?.length || 0,
    }));
  }

  // ============================================================
  // ✅ 2️⃣ Obtener un curso por ID
  // ============================================================
  async findOne(id: number) {
    if (!id || isNaN(id)) {
      console.warn('⚠️ findOne() llamado con ID inválido:', id);
      throw new BadRequestException('Invalid course ID');
    }

    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['commissions', 'career'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Resolver correlativas
    const correlatives =
      course.correlates?.length > 0
        ? await this.courseRepo.findByIds(course.correlates)
        : [];

    return {
      id: course.id,
      code: course.code,
      name: course.name,
      description: course.description,
      career: course.career ? course.career.name : null,
      correlatives: correlatives.map((c) => ({
        id: c.id,
        name: c.name,
      })),
      commissions: course.commissions || [],
    };
  }

  // ============================================================
  // ✅ 3️⃣ Obtener todos los cursos de la carrera del usuario autenticado
  // ============================================================
  async findCoursesForUser(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['career'],
    });

    if (!user || !user.career) {
      throw new NotFoundException('User or career not found');
    }

    const courses = await this.courseRepo.find({
      where: { career: { id: user.career.id } },
      relations: ['career'],
    });

    if (!courses.length) {
      throw new NotFoundException('No courses found for this career');
    }

    return Promise.all(
      courses.map(async (c) => {
        const correlatives =
          c.correlates?.length > 0
            ? await this.courseRepo.findByIds(c.correlates)
            : [];
        return {
          id: c.id,
          code: c.code,
          name: c.name,
          description: c.description,
          career: user.career.name,
          correlatives: correlatives.map((corr) => ({
            id: corr.id,
            name: corr.name,
          })),
        };
      }),
    );
  }

  // ============================================================
  // ✅ 4️⃣ Crear un nuevo curso
  // ============================================================
  async create(courseData: Partial<Course>) {
    if (!courseData.name || !courseData.code) {
      throw new BadRequestException('Missing course name or code');
    }

    const course = this.courseRepo.create(courseData);
    return this.courseRepo.save(course);
  }
}
