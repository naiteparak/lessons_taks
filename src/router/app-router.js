import express from 'express';
import { appController } from '../controller /app-controller.js';
import { checkFilters } from '../middleware/check-filters.js';
import { checkReqBody } from '../middleware/check-req-body.js';

export const appRouter = express.Router();

appRouter
  .get('/', checkFilters, appController.getLessons)
  .post('/lessons', checkReqBody, appController.createLessons);
