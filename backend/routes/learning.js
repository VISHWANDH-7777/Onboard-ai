import express from 'express';
import { LearningPath } from '../models/LearningPath.js';
import { authenticate } from '../middleware/auth.js';

export const learningRouter = express.Router();

learningRouter.get('/:analysisId', authenticate, async (req, res) => {
  try {
    const learning = await LearningPath.findOne({ analysisId: req.params.analysisId });
    if (!learning) {
      return res.status(404).json({ message: 'Learning modules not found' });
    }

    return res.json({ learningModules: learning.modules });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch learning path', error: error.message });
  }
});
