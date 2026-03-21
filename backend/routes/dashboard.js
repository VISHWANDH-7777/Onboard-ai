import express from 'express';
import { Analysis } from '../models/Analysis.js';

export const dashboardRouter = express.Router();

dashboardRouter.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const analyses = await Analysis.find({ userId }).sort({ createdAt: -1 }).limit(10);

    const totalAnalyses = await Analysis.countDocuments({ userId });
    const avgScore =
      analyses.length > 0
        ? Number((analyses.reduce((sum, item) => sum + item.matchScore, 0) / analyses.length).toFixed(2))
        : 0;

    const recentActivities = analyses.map((item) => ({
      analysisId: item.analysisId,
      targetRole: item.targetRole,
      score: item.matchScore,
      createdAt: item.createdAt,
    }));

    return res.json({ totalAnalyses, avgScore, recentActivities });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load dashboard', error: error.message });
  }
});
