import { Router } from 'express';
import { pageRouter } from './pageRoutes';
import { apiRouter } from './apiRoutes';

export const router = Router();

// Remove cache
router.use((req, res, next) => {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  );
  next();
});
// Pages
router.use(pageRouter);

// API
router.use('/api', apiRouter);
