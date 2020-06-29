import { Router } from 'express';
import { pageRouter } from './pageRoutes';
import { apiRouter } from './apiRoutes';

export const router = Router();

// Pages
router.use(pageRouter);

// API
router.use('/api', apiRouter);
