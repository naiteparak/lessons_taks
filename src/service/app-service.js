import { knexConfig as knex } from '../configs/knex-config.js';
import { calculateDates } from '../utils/calculate-dates.js';

class AppService {
  async getLessons(filters, page = 1, lessonsPerPage = 5) {
    const query = knex('lessons')
      .leftJoin('lesson_teachers', 'lessons.id', 'lesson_teachers.lesson_id')
      .leftJoin('teachers', 'lesson_teachers.teacher_id', 'teachers.id')
      .leftJoin('lesson_students', 'lessons.id', 'lesson_students.lesson_id')
      .leftJoin('students', 'lesson_students.student_id', 'students.id')
      .select(
        'lessons.*',
        knex.raw(
          'CAST(COUNT(DISTINCT CASE WHEN lesson_students.visit = true THEN students.id END) AS INTEGER) AS visitCount',
        ),
        knex.raw(`
          ARRAY_AGG(DISTINCT jsonb_build_object('id', students.id, 'name', students.name, 'visit', lesson_students.visit))
          FILTER (WHERE students.id IS NOT NULL) as students
        `),
        knex.raw(`
          ARRAY_AGG(DISTINCT jsonb_build_object('id', teachers.id, 'name', teachers.name))
          FILTER (WHERE teachers.id IS NOT NULL) as teachers
        `),
      )
      .groupBy('lessons.id', 'lessons.date', 'lessons.title', 'lessons.status')
      .orderBy('lessons.date');

    if (filters.date && filters.date.length === 1)
      query.where('lessons.date', filters.date[0]);
    else if (filters.date && filters.date.length === 2)
      query.whereBetween('lessons.date', filters.date);

    if (filters.status) {
      query.where('lessons.status', filters.status);
    }

    if (filters.teacherIds) {
      query.whereIn('teachers.id', filters.teacherIds);
    }

    if (filters.studentsCount && filters.studentsCount.length === 2) {
      query.havingRaw(
        'COUNT(DISTINCT students.id) BETWEEN ? AND ?',
        filters.studentsCount,
      );
    } else if (filters.studentsCount && filters.studentsCount.length === 1) {
      query.havingRaw('COUNT(DISTINCT students.id) = ?', filters.studentsCount);
    }

    if (page && lessonsPerPage) {
      const offset = (page - 1) * lessonsPerPage;
      query.offset(offset).limit(lessonsPerPage);
    }

    return query;
  }

  async createLessons(
    teacherIds,
    title,
    days,
    firstDate,
    lessonsCount,
    lastDate,
  ) {
    const generatedDates = calculateDates(
      days,
      firstDate,
      lastDate,
      lessonsCount,
    );

    const lessonRows = generatedDates.map((date) => {
      return {
        date,
        title,
        status: 0,
      };
    });

    const insertedLessons = await knex
      .batchInsert('lessons', lessonRows, lessonRows.length)
      .returning('id');

    const lessonTeacherRows = [];

    for (const lesson of insertedLessons) {
      for (const teacherId of teacherIds) {
        lessonTeacherRows.push({
          lesson_id: lesson.id,
          teacher_id: teacherId,
        });
      }
    }

    await knex.batchInsert(
      'lesson_teachers',
      lessonTeacherRows,
      lessonTeacherRows.length,
    );

    return insertedLessons;
  }
}

export const appService = new AppService();
