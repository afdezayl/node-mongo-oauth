import { Schema, model, Document } from 'mongoose';

export interface IStory extends Document {
  title: string;
  body: string;
  status: 'public' | 'private';
  user: any;
  createdAt: Date;
}

const StorySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<IStory>('Story', StorySchema);
