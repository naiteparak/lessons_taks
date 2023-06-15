import express from 'express';
import { appController } from '../controller /app-controller.js';
import { checkFilters } from '../middleware/check-filters.js';

export const appRouter = express.Router();

appRouter.get('/', checkFilters, appController.getLessons);
