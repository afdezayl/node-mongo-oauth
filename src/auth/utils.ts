import { Request, Response, NextFunction } from 'express';
import firebase from 'firebase-admin';

export const ensureValidSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionCookie = req?.session?.token;
  const isValidSession = await verifySession(sessionCookie);
  if (!isValidSession) {
    return res.redirect('/');
  }
  next();
};

export const ensureGuestSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionCookie = req?.session?.token;

  if (await verifySession(sessionCookie)) {
    return res.redirect('/dashboard');
  }
  next();
};

export const checkTokenAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = (req.headers?.authtoken as string) ?? '';
    const claims = await firebase.auth().verifyIdToken(token);
    next();
  } catch (err) {
    console.log('forbidden....', err);
    res.sendStatus(403);
  }
};

async function verifySession(sessionCookie: string): Promise<boolean> {
  if (!sessionCookie) {
    return false;
  }

  try {
    await firebase.auth().verifySessionCookie(sessionCookie, true);
    return true;
  } catch (err) {
    return false;
  }
}
