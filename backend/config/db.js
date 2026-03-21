import mongoose from 'mongoose';

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nebula_ai';

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected to ${mongoUri}`);
  } catch (error) {
    console.error('[MongoDB] Connection failed:', error.message);
    throw error;
  }
}
