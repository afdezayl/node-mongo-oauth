import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env['MONGO_URI'] ?? '';
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
