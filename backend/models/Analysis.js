import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    analysisId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    targetRole: { type: String, default: '' },
    experienceLevel: { type: String, default: '' },
    resumeText: { type: String, required: true },
    jobDescription: { type: String, required: true },
    matchScore: { type: Number, required: true },
    skills: {
      resumeSkills: [{ type: String }],
      requiredSkills: [{ type: String }],
      matchedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      weakSkills: [{ type: String }],
    },
    reasoning: [{ type: String }],
    learningPath: [
      {
        skill: String,
        steps: [String],
        duration: String,
      },
    ],
    careerPath: {
      currentRole: String,
      targetRole: String,
      timeline: [String],
    },
    rerunOf: { type: String, default: null },
  },
  { timestamps: true },
);

export const Analysis = mongoose.model('Analysis', analysisSchema);
