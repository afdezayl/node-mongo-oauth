import { Router, request } from 'express';
import { ensureValidSession, ensureGuestSession } from '../api/auth/utils';
import Story from '../api/stories/models/Story';

import { storiesRouter } from '../api/stories/routes';

export const pageRouter = Router();

// Pages
pageRouter.get('/', ensureGuestSession, (req, res) => {
  res.render('login', { layout: 'login' });
});

pageRouter.use('/stories', storiesRouter);

pageRouter.get('/dashboard', ensureValidSession, async (req, res) => {
  const user = req.user;
  try {
    const stories = await Story.find({ user: user?.db_user._id }).lean();
    res.render('dashboard', {
      name: req?.user!.name ?? '',
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

pageRouter.get('/logout', async (req, res) => {
  req.session?.destroy((err) => {
    const cookieName = process.env.SESSION_COOKIE_NAME || 'session';
    res.clearCookie(cookieName).redirect('/');
  });
});
