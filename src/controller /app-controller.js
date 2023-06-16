import { appService } from '../service/app-service.js';
import { STATUS_CODES } from '../responses/status-codes.js';
import { logger } from '../configs/logger.js';
import { ERROR_MESSAGES } from '../responses/messages.js';

class AppController {
  async getLessons(req, res) {
    try {
      const { date, status, teacherIds, studentsCount, page, lessonsPerPage } =
        req.query;

      const lessons = await appService.getLessons(
        {
          date,
          status,
          teacherIds,
          studentsCount,
        },
        page,
        lessonsPerPage,
      );

      res.status(STATUS_CODES.OK).send(lessons);
    } catch (error) {
      logger.log('error', {
        error: error.message,
      });
      res
        .status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}

export const appController = new AppController();
