import express from 'express';
import { Analysis } from '../models/Analysis.js';
import { authenticate } from '../middleware/auth.js';

export const resultsRouter = express.Router();

resultsRouter.get('/:analysisId', authenticate, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      analysisId: req.params.analysisId,
      userId: req.user.userId,
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Result not found' });
    }

    return res.json({
      matchScore: analysis.matchScore,
      matchedSkills: analysis.skills?.matchedSkills || [],
      missingSkills: analysis.skills?.missingSkills || [],
      weakSkills: analysis.skills?.weakSkills || [],
      reasoning: analysis.reasoning || [],
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch result', error: error.message });
  }
});

resultsRouter.get('/history/:userId', authenticate, async (req, res) => {
  try {
    if (req.params.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const history = await Analysis.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select('analysisId targetRole matchScore createdAt rerunOf');

    return res.json({ items: history });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load history', error: error.message });
  }
});

resultsRouter.get('/compare/:analysisA/:analysisB', authenticate, async (req, res) => {
  try {
    const [a, b] = await Promise.all([
      Analysis.findOne({ analysisId: req.params.analysisA, userId: req.user.userId }),
      Analysis.findOne({ analysisId: req.params.analysisB, userId: req.user.userId }),
    ]);

    if (!a || !b) {
      return res.status(404).json({ message: 'One or both analyses not found' });
    }

    return res.json({
      analysisA: { analysisId: a.analysisId, score: a.matchScore, createdAt: a.createdAt },
      analysisB: { analysisId: b.analysisId, score: b.matchScore, createdAt: b.createdAt },
      scoreDelta: b.matchScore - a.matchScore,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Comparison failed', error: error.message });
  }
});
