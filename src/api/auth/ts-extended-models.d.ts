export {};
import { auth } from 'firebase-admin';
import { IUser } from './models/User';

declare global {
  namespace Express {
    interface Request {
      /**
       * Only routes after "ensureValidSession" middleware
       */
      user?: FirebaseUser;
    }
  }
}

interface FirebaseUser extends auth.DecodedIdToken {
  db_user: IUser;
}
