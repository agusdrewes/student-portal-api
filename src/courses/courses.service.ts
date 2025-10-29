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
      console.warn('⚠️ findOne() recibió un ID inválido (NaN o null):', id);
      return null; // ✅ devolvemos null en lugar de lanzar error
    }
    

    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['commissions', 'careers'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // ✅ Limpieza de correlativas con IDs válidos
const validCorrelates = (course.correlates || []).filter(
  (id) => typeof id === 'number' && !isNaN(id) && id > 0
);

const correlatives =
  validCorrelates.length > 0
    ? await this.courseRepo.find({ where: { id: In(validCorrelates) } })
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
        const validCorrelates = (c.correlates || []).filter(
          (id) => typeof id === 'number' && !isNaN(id) && id > 0
        );
        
        const correlatives =
          validCorrelates.length > 0
            ? await this.courseRepo.find({ where: { id: In(validCorrelates) } })
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

  // ============================================================
// ✅ NUEVO: Filtrar cursos disponibles para inscripción
// ============================================================
async findAvailableCoursesForUser(userId: number) {
  // 1️⃣ Buscar usuario con su carrera
  const user = await this.userRepo.findOne({
    where: { id: userId },
    relations: ['career'],
  });

  if (!user || !user.career) {
    throw new NotFoundException('User or career not found');
  }

  // 2️⃣ Traer todos los cursos de su carrera con comisiones
  const allCourses = await this.courseRepo
    .createQueryBuilder('course')
    .leftJoinAndSelect('course.careers', 'career')
    .leftJoinAndSelect('course.commissions', 'commission')
    .where('career.id = :careerId', { careerId: user.career.id })
    .getMany();

  // 3️⃣ Traer historial académico del usuario
  const history = await this.courseRepo.manager
    .getRepository('academic_history')
    .createQueryBuilder('h')
    .leftJoinAndSelect('h.course', 'course')
    .where('h.userId = :userId', { userId })
    .getMany();

  // ✅ Clasificamos los cursos según su estado
  const approvedIds = history
    .filter((h) => h.status === 'passed')
    .map((h) => h.course.id);

  const inProgressIds = history
    .filter((h) => h.status === 'in_progress')
    .map((h) => h.course.id);

  // 4️⃣ Filtrar cursos que:
  // - no estén aprobados
  // - no tengan correlativas pendientes
  // - (in_progress también se incluyen)
  const availableCourses = allCourses.filter((course) => {
    const alreadyApproved = approvedIds.includes(course.id);
    const validCorrelates = (course.correlates || [])
      .map((id) => Number(id))
      .filter((id) => !isNaN(id) && id > 0);

    const pendingCorrelatives = validCorrelates.some(
      (corrId) => !approvedIds.includes(corrId),
    );

    // Si está cursando, se incluye
    if (inProgressIds.includes(course.id)) return true;

    // Si no tiene correlativas pendientes ni está aprobada, se incluye
    return !alreadyApproved && !pendingCorrelatives;
  });

  // 5️⃣ Agregar comisiones con estado "future"
  const today = new Date();

  return availableCourses.map((c) => {
    let status = 'available';
    if (approvedIds.includes(c.id)) status = 'passed';
    else if (inProgressIds.includes(c.id)) status = 'in_progress';

    // 🕒 Filtrar comisiones FUTURAS
    const futureCommissions =
      (c.commissions || []).filter((comm) => {
        const start = new Date(comm.startDate);
        return start > today; // empieza en el futuro
      }) || [];

    return {
      id: c.id,
      code: c.code,
      name: c.name,
      description: c.description,
      correlates: c.correlates,
      status,
      commissions:
        status === 'available' ? futureCommissions.map((comm) => ({
          id: comm.id,
          days: comm.days,
          shift: comm.shift,
          mode: comm.mode,
          startTime: comm.startTime,
          endTime: comm.endTime,
          classRoom: comm.classRoom,
          professorName: comm.professorName,
          availableSpots: comm.availableSpots,
          totalSpots: comm.totalSpots,
          startDate: comm.startDate,
          endDate: comm.endDate,
        })) : [],
    };
  });
}


}
