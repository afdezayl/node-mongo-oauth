import { Router } from 'express';
import firebase from 'firebase-admin';

export const authRoutes = Router();

authRoutes.post('/login', async (req, res) => {
  const idToken = req.body?.idToken?.toString() ?? '';
  const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days
  try {
    const cookie = await firebase
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    req!.session!.token = cookie;
    res.send({ status: 'success' });
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
});
