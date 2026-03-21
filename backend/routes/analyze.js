import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { analyzeWithPython } from '../services/pythonClient.js';
import { extractTextFromFile } from '../services/textExtract.js';
import { Analysis } from '../models/Analysis.js';
import { LearningPath } from '../models/LearningPath.js';
import { authenticate } from '../middleware/auth.js';

const upload = multer({ storage: multer.memoryStorage() });

export const analyzeRouter = express.Router();

analyzeRouter.post('/', authenticate, upload.single('resumeFile'), async (req, res) => {
  try {
    const { resumeText, jobDescription, targetRole, experienceLevel } = req.body;
    console.log('[Analyze] Incoming payload', {
      hasResumeText: Boolean(resumeText),
      hasJobDescription: Boolean(jobDescription),
      targetRole,
      experienceLevel,
      hasFile: Boolean(req.file),
    });
    const extractedText = await extractTextFromFile(req.file);
    const finalResumeText = (resumeText || extractedText || '').trim();

    if (!finalResumeText || !jobDescription) {
      return res.status(400).json({ message: 'resumeText (or resume file) and jobDescription are required' });
    }

    const aiResponse = await analyzeWithPython({
      resume_text: finalResumeText,
      job_description: jobDescription,
      target_role: targetRole || '',
      experience_level: experienceLevel || 'Intermediate',
    });
    console.log('[Analyze] Python response received', {
      matchScore: aiResponse.matchScore,
      matchedCount: aiResponse.matchedSkills?.length || 0,
      missingCount: aiResponse.missingSkills?.length || 0,
    });

    const analysisId = uuidv4();
    const analysisDoc = await Analysis.create({
      analysisId,
      userId: req.user.userId,
      targetRole: targetRole || aiResponse.careerPath?.targetRole || '',
      experienceLevel: experienceLevel || 'Intermediate',
      resumeText: finalResumeText,
      jobDescription,
      matchScore: aiResponse.matchScore,
      skills: {
        resumeSkills: aiResponse.resumeSkills,
        requiredSkills: aiResponse.requiredSkills,
        matchedSkills: aiResponse.matchedSkills,
        missingSkills: aiResponse.missingSkills,
        weakSkills: aiResponse.weakSkills,
      },
      reasoning: aiResponse.reasoning,
      learningPath: aiResponse.learningPath,
      careerPath: aiResponse.careerPath,
    });

    await LearningPath.findOneAndUpdate(
      { analysisId },
      { analysisId, modules: aiResponse.learningPath },
      { upsert: true, new: true },
    );

    return res.json({
      analysisId,
      matchScore: analysisDoc.matchScore,
      matchedSkills: analysisDoc.skills.matchedSkills,
      missingSkills: analysisDoc.skills.missingSkills,
      learningPath: analysisDoc.learningPath,
      careerPath: analysisDoc.careerPath,
    });
  } catch (error) {
    console.error('[Analyze] Failed', error.message);
    return res.status(500).json({ message: 'Analysis failed', error: error.message });
  }
});

analyzeRouter.post('/:analysisId/rerun', authenticate, async (req, res) => {
  try {
    const base = await Analysis.findOne({ analysisId: req.params.analysisId, userId: req.user.userId });
    if (!base) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const aiResponse = await analyzeWithPython({
      resume_text: base.resumeText,
      job_description: base.jobDescription,
      target_role: base.targetRole || '',
      experience_level: base.experienceLevel || 'Intermediate',
    });

    const analysisId = uuidv4();
    const rerun = await Analysis.create({
      analysisId,
      userId: base.userId,
      targetRole: base.targetRole,
      experienceLevel: base.experienceLevel,
      resumeText: base.resumeText,
      jobDescription: base.jobDescription,
      matchScore: aiResponse.matchScore,
      skills: {
        resumeSkills: aiResponse.resumeSkills,
        requiredSkills: aiResponse.requiredSkills,
        matchedSkills: aiResponse.matchedSkills,
        missingSkills: aiResponse.missingSkills,
        weakSkills: aiResponse.weakSkills,
      },
      reasoning: aiResponse.reasoning,
      learningPath: aiResponse.learningPath,
      careerPath: aiResponse.careerPath,
      rerunOf: base.analysisId,
    });

    await LearningPath.findOneAndUpdate(
      { analysisId },
      { analysisId, modules: aiResponse.learningPath },
      { upsert: true, new: true },
    );

    return res.json({ analysisId: rerun.analysisId, matchScore: rerun.matchScore });
  } catch (error) {
    return res.status(500).json({ message: 'Rerun failed', error: error.message });
  }
});
