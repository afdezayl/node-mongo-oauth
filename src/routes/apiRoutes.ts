import { Router } from 'express';
import { authRoutes } from '../auth';

export const apiRouter = Router();

// auth
apiRouter.use('/auth', authRoutes);

// Stories
//apiRouter.use('/stories', authRoutes);
