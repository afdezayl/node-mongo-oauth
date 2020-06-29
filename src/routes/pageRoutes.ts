import { Router } from 'express';
import { ensureValidSession, ensureGuestSession } from '../auth/utils';

export const pageRouter = Router();

// Pages
pageRouter.get('/', ensureGuestSession, (req, res) => {
  res.render('login', { layout: 'login' });
});

pageRouter.get('/dashboard', ensureValidSession, (req, res) => {
  res.render('dashboard');
});

pageRouter.get('/logout', async (req, res) => {
  req.session?.destroy((err) => {
    const cookieName = process.env.SESSION_COOKIE_NAME || 'session';
    res.clearCookie(cookieName).redirect('/');
  });
});
