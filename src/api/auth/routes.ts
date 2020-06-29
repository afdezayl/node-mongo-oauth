import { Router } from 'express';
import firebase from 'firebase-admin';
import User, { IUser } from './models/User';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const idToken = req.body?.idToken?.toString() ?? '';
  const expiresIn = 60 * 60 * 24 * 7 * 1000; // 7 days
  try {
    const claims = await firebase.auth().verifyIdToken(idToken, true);
    const cookie = await firebase
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    const user = {
      uid: claims.uid,
      name: claims.name,
      email: claims.email,
      image: claims.picture,
    };

    await User.updateOne({ uid: user.uid }, user, { upsert: true });

    req!.session!.token = cookie;
    res.send({ status: 'success' });
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
});
