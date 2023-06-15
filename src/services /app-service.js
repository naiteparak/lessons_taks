import { knexConfig as knex } from '../config/knex-config.js';

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
          knex.raw(
            'COUNT(DISTINCT CASE WHEN lesson_students.visit = true THEN students.id END) AS visitCount',
          ),
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

    if (filters.dates) {
      if (filters.dates.length === 1)
        query.where('lessons.date', filters.dates[0]);
      else if (filters.dates.length === 2)
        query.whereBetween('lessons.date', filters.dates);
    }

    if (filters.status) {
      query.where('lessons.status', filters.status);
    }

    if (filters.teacherIds) {
      const teacherIds = filters.teacherIds.split(','); //TODO
      query.whereIn('teachers.id', teacherIds);
    }

    if (filters.studentsCount) {
      if (filters.studentsCount.includes(',')) {
        //TODO
        const [minCount, maxCount] = filters.studentsCount.split(',');
        query.havingRaw('COUNT(DISTINCT students.id) BETWEEN ? AND ?', [
          parseInt(minCount),
          parseInt(maxCount),
        ]);
      } else {
        const exactCount = parseInt(filters.studentsCount);
        query.havingRaw('COUNT(DISTINCT students.id) = ?', exactCount);
      }
    }

    if (page && lessonsPerPage) {
      const offset = (page - 1) * lessonsPerPage;
      query.offset(offset).limit(lessonsPerPage);
    }

    return query;
  }
}

export const appService = new AppService();
