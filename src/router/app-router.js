import express from 'express';
import { appController } from '../controller /app-controller.js';

export const appRouter = express.Router();

appRouter.get('/', appController.getLessons);
