import { appService } from '../services /app-service.js';
import { isDateValid } from '../utils/is-date-valid.js';

class AppController {
  async getLessons(req, res) {
    try {
      const { date, status, teacherIds, studentsCount, page, lessonsPerPage } =
        req.query;

      let dates;
      if (date) {
        dates = date.split(',');
        if (isDateValid(dates)) {
          const error = new Error('Invalid input for date');
          error.statusCode = 400;
          return res.status(error.statusCode).json({ error: error.message });
        }
      }

      const lessons = await appService.getLessons(
        {
          dates,
          status,
          teacherIds,
          studentsCount,
        },
        page,
        lessonsPerPage,
      );

      res.status(200).send(lessons);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

export const appController = new AppController();
