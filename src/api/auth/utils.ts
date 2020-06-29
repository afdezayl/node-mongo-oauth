import { Request, Response, NextFunction } from 'express';
import User from './models/User';
import firebase from 'firebase-admin';

export const ensureValidSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionCookie = req?.session?.token;
  const claims = await verifySession(sessionCookie);
  const db_user = await User.findOne({ uid: claims?.uid });
  if (!claims) {
    return res.redirect('/');
  }
  req.user = { ...claims, db_user };
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

async function verifySession(
  sessionCookie: string
): Promise<firebase.auth.DecodedIdToken | null> {
  if (!sessionCookie) {
    return null;
  }

  try {
    const claims = await firebase
      .auth()
      .verifySessionCookie(sessionCookie, true);
    return claims;
  } catch (err) {
    return null;
  }
}
