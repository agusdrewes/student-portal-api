import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
      relations: ['commissions', 'careers'],
    });

    if (!courses.length) {
      throw new NotFoundException('No courses found');
    }

    return courses.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      description: c.description,
      careers: c.careers?.map((career) => career.name) || [],
      totalCommissions: c.commissions?.length || 0,
    }));
  }

  // ============================================================
  // ✅ 2️⃣ Obtener un curso por ID (con correlativas y carreras)
  // ============================================================
  async findOne(id: number) {
    if (!id || isNaN(id)) {
      console.warn('⚠️ findOne() llamado con ID inválido:', id);
      throw new BadRequestException('Invalid course ID');
    }

    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['commissions', 'careers'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    const correlatives =
      course.correlates?.length > 0
        ? await this.courseRepo.find({ where: { id: In(course.correlates) } })
        : [];

    return {
      id: course.id,
      code: course.code,
      name: course.name,
      description: course.description,
      careers: course.careers?.map((career) => ({
        id: career.id,
        name: career.name,
      })),
      correlatives: correlatives.map((c) => ({
        id: c.id,
        name: c.name,
      })),
      commissions: course.commissions || [],
    };
  }

  // ============================================================
  // ✅ 3️⃣ Obtener los cursos de las carreras del usuario autenticado
  // ============================================================
  async findCoursesForUser(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['career'],
    });

    if (!user || !user.career) {
      throw new NotFoundException('User or career not found');
    }

    // 💡 Buscar todos los cursos donde la carrera del usuario esté asociada
    const courses = await this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.careers', 'career')
      .where('career.id = :careerId', { careerId: user.career.id })
      .leftJoinAndSelect('course.commissions', 'commission')
      .getMany();

    if (!courses.length) {
      throw new NotFoundException('No courses found for this career');
    }

    return Promise.all(
      courses.map(async (c) => {
        const correlatives =
          c.correlates?.length > 0
            ? await this.courseRepo.find({ where: { id: In(c.correlates) } })
            : [];
        return {
          id: c.id,
          code: c.code,
          name: c.name,
          description: c.description,
          careers: c.careers?.map((car) => car.name) || [],
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
