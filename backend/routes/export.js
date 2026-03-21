import express from 'express';
import path from 'path';
import { Analysis } from '../models/Analysis.js';
import { authenticate } from '../middleware/auth.js';
import { generateAnalysisPdf } from '../services/exportService.js';

export const exportRouter = express.Router();

exportRouter.get('/:analysisId', authenticate, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      analysisId: req.params.analysisId,
      userId: req.user.userId,
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const pdf = await generateAnalysisPdf(analysis);
    const shareLink = `${process.env.PUBLIC_BASE_URL || 'http://localhost:4000'}/reports/${analysis.analysisId}`;

    if (req.query.download === 'true') {
      return res.download(pdf.filePath, pdf.fileName);
    }

    return res.json({
      message: 'Report generated and saved',
      fileName: pdf.fileName,
      reportPath: path.relative(process.cwd(), pdf.filePath).replace(/\\/g, '/'),
      shareLink,
      saved: true,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Export failed', error: error.message });
  }
});
