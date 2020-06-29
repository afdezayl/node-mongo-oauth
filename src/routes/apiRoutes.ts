import { Router } from 'express';
import { authRouter } from '../api/auth/routes';
// import { storiesRouter } from '../api/stories/routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
// apiRouter.use('/stories', storiesRouter);
