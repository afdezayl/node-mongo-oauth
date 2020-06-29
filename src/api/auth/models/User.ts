import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  name: string;
  email?: string;
  image?: string;
}

const UserSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String
  },
  image: {
    type: String,
  },
});

export default model<IUser>('User', UserSchema);
