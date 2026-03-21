import express from 'express';
import { Analysis } from '../models/Analysis.js';
import { authenticate } from '../middleware/auth.js';

export const careerRouter = express.Router();

careerRouter.get('/:analysisId', authenticate, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      analysisId: req.params.analysisId,
      userId: req.user.userId,
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Career path not found' });
    }

    return res.json({
      currentRole: analysis.careerPath?.currentRole || 'Current Role',
      targetRole: analysis.careerPath?.targetRole || analysis.targetRole || 'Target Role',
      timeline: analysis.careerPath?.timeline || [],
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch career path', error: error.message });
  }
});
