import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
