import mongoose from 'mongoose';

const learningPathSchema = new mongoose.Schema(
  {
    analysisId: { type: String, required: true, unique: true, index: true },
    modules: [
      {
        skill: { type: String, required: true },
        steps: [{ type: String, required: true }],
        duration: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

export const LearningPath = mongoose.model('LearningPath', learningPathSchema);
