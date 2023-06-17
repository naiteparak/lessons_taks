import { STATUS_CODES } from '../responses/status-codes.js';
import { ERROR_MESSAGES } from '../responses/messages.js';
import { isDateValid } from '../utils/is-date-valid.js';
import { logger } from '../configs/logger.js';
import { checkTeacherId } from '../utils/check-teacher-id.js';

export const checkReqBody = async function (req, res, next) {
  const reqBody = req.body;
  if (
    (reqBody.lessonsCount && reqBody.lastDate) ||
    (!reqBody.lessonsCount && !reqBody.lastDate)
  ) {
    logger.log('error', {
      error: ERROR_MESSAGES.LESSON_COUNT_AND_LAST_DATE_CONFLICT,
    });
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: ERROR_MESSAGES.LESSON_COUNT_AND_LAST_DATE_CONFLICT });
  }

  if (reqBody.lessonsCount && reqBody.lessonsCount > 300) {
    logger.log('error', {
      error: ERROR_MESSAGES.LESSON_COUNT,
    });
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: ERROR_MESSAGES.LESSON_COUNT });
  }

  if (reqBody.lastDate && reqBody.firstDate) {
    if (isDateValid([reqBody.lastDate, reqBody.firstDate])) {
      logger.log('error', {
        error: ERROR_MESSAGES.INVALID_DATE,
      });
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: ERROR_MESSAGES.INVALID_DATE });
    }
    const dif = Math.abs(
      new Date(
        new Date(reqBody.lastDate.trim()) -
          new Date(reqBody.firstDate.trim()) -
          1,
      ).getUTCFullYear() - 1970,
    );
    if (dif >= 1) {
      logger.log('error', {
        error: ERROR_MESSAGES.INVALID_DATES_INTERVAL,
      });
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: ERROR_MESSAGES.INVALID_DATES_INTERVAL });
    }
  }

  if (
    !reqBody.teacherIds ||
    !reqBody.title ||
    !reqBody.days ||
    !reqBody.firstDate
  ) {
    logger.log('error', {
      error: ERROR_MESSAGES.PROVIDE_ALL_DATA,
    });
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: ERROR_MESSAGES.PROVIDE_ALL_DATA });
  }

  if (!Array.isArray(reqBody.teacherIds) || !Array.isArray(reqBody.days)) {
    logger.log('error', {
      error: ERROR_MESSAGES.INVALID_TEACHERS_IDS_OR_DAYS,
    });
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ error: ERROR_MESSAGES.INVALID_TEACHERS_IDS_OR_DAYS });
  }

  for (const id of reqBody.teacherIds) {
    if (!(await checkTeacherId('teachers', id))) {
      logger.log('error', {
        error: `${ERROR_MESSAGES.INVALID_TEACHER_ID}${id}`,
      });
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: `${ERROR_MESSAGES.INVALID_TEACHER_ID}${id}` });
    }
  }

  next();
};
