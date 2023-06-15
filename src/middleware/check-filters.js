import { isDateValid } from '../utils/is-date-valid.js';
import { ERROR_MESSAGES } from '../messages/messages.js';
import { STATUS_CODES } from '../messages/status-codes.js';

export const checkFilters = function (req, res, next) {
  const filters = req.query;

  if (filters.date) {
    const dates = filters.date.split(',');
    if (isDateValid(dates)) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: ERROR_MESSAGES.INVALID_DATE });
    }
    filters.date = dates;
  }

  if (filters.status) {
    if (filters.status < 0 || filters.status > 1) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: ERROR_MESSAGES.INVALID_STATUS });
    }
  }

  if (filters.teacherIds) {
    if (
      !filters.teacherIds
        .trim()
        .match(/^(\d+(,\s*\d+)?|,\s*\d+|\d+(,\s*\d+)*)$/)
    ) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: ERROR_MESSAGES.INVALID_TEACHER_ID });
    } else filters.teacherIds = filters.teacherIds.trim().split(',');
  }

  if (filters.studentsCount) {
    if (filters.studentsCount.includes(',')) {
      if (
        !filters.studentsCount
          .trim()
          .match(/^(\d+(,\s*\d+)?|,\s*\d+|\d+(,\s*\d+)*)$/)
      ) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ error: ERROR_MESSAGES.INVALID_STUDENTS_COUNT });
      } else filters.studentsCount = filters.studentsCount.split(',');
    } else {
      if (!filters.studentsCount.match(/^\d+$/)) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ error: ERROR_MESSAGES.INVALID_STUDENTS_COUNT });
      }
    }
  }

  if (filters.page && filters.lessonsPerPage) {
    if (
      !filters.page.trim().match(/^\d+$/) ||
      !filters.lessonsPerPage.trim().match(/^\d+$/)
    ) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ error: ERROR_MESSAGES.INVALID_PAGINATION });
    }
  }
  next();
};
