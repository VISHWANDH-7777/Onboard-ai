import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { GoogleGenAI, Type } from '@google/genai';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || 3001);
const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const aiTimeoutMs = Number(process.env.AI_TIMEOUT_MS || 20000);
const aiMaxRetries = Number(process.env.AI_MAX_RETRIES || 3);
const jwtSecret = process.env.JWT_SECRET || 'dev-only-secret-change-me';
const jwtExpiry = process.env.JWT_EXPIRES_IN || '7d';
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';

const googleOAuthClient = new OAuth2Client(googleClientId || undefined);

app.use(express.json({ limit: '2mb' }));
app.use(cors({ origin: '*' }));

let mongoClient = null;
let usersCollection = null;
let analysisCollection = null;

if (!process.env.JWT_SECRET) {
  console.warn('[AUTH] JWT_SECRET not set. Using insecure development fallback secret.');
}

if (!process.env.GOOGLE_CLIENT_ID) {
  console.warn('[AUTH] GOOGLE_CLIENT_ID not set. Google OAuth route will not be available.');
}

function sendSuccess(res, message, data = {}, status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

function sendError(res, status, message, data = {}) {
  return res.status(status).json({
    success: false,
    message,
    data,
  });
}

function ensureString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

function toObjectId(value) {
  try {
    return new ObjectId(value);
  } catch {
    return null;
  }
}

function sanitizeUser(doc) {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    provider: doc.provider,
    createdAt: doc.createdAt,
  };
}

function issueToken(user) {
  return jwt.sign(
    {
      userId: String(user._id),
      email: user.email,
      provider: user.provider,
    },
    jwtSecret,
    { expiresIn: jwtExpiry }
  );
}

function sanitizeBodyForLog(body) {
  const resumePreview = typeof body?.resumeText === 'string' ? body.resumeText.slice(0, 300) : '';
  const rolePreview = typeof body?.jobDescription === 'string' ? body.jobDescription.slice(0, 300) : '';

  return {
    userId: body?.userId || '',
    resumeChars: body?.resumeText?.length || 0,
    roleChars: body?.jobDescription?.length || 0,
    resumePreview,
    rolePreview,
  };
}

function isRetryableError(err) {
  const code = err?.code || '';
  const status = err?.status || err?.statusCode || 0;
  const message = (err?.message || '').toLowerCase();

  return (
    code === 'ABORT_ERR' ||
    code === 'ETIMEDOUT' ||
    code === 'ECONNRESET' ||
    status === 429 ||
    status >= 500 ||
    message.includes('timeout') ||
    message.includes('temporarily unavailable') ||
    message.includes('rate')
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildFallbackAnalysis(resumeText, roleRequirements) {
  const normalizeWords = (text) =>
    (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9+.#\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

  const resumeWords = new Set(normalizeWords(resumeText));
  const jdWords = new Set(normalizeWords(roleRequirements));

  const skillKeywords = [
    'node.js',
    'node',
    'express',
    'mongodb',
    'mongoose',
    'typescript',
    'javascript',
    'react',
    'sql',
    'python',
    'aws',
    'docker',
    'kubernetes',
    'redis',
    'graphql',
    'rest',
    'ci/cd',
    'git',
  ];

  const jdSkills = skillKeywords.filter((skill) => {
    const token = skill.toLowerCase();
    return Array.from(jdWords).some((word) => word.includes(token) || token.includes(word));
  });

  const mastered = [];
  const missing = [];

  for (const skill of jdSkills) {
    const token = skill.toLowerCase();
    const hasSkill = Array.from(resumeWords).some((word) => word.includes(token) || token.includes(word));
    if (hasSkill) {
      mastered.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const total = Math.max(jdSkills.length, 1);
  const score = Math.round((mastered.length / total) * 100);

  const skills = [
    ...mastered.map((name) => ({ name, level: 75, status: 'mastered' })),
    ...missing.map((name) => ({ name, level: 35, status: 'gap' })),
  ];

  if (skills.length === 0) {
    skills.push(
      { name: 'communication', level: 60, status: 'developing' },
      { name: 'problem-solving', level: 65, status: 'developing' },
      { name: 'system-design', level: 40, status: 'gap' }
    );
  }

  return {
    score,
    skills,
    reasoning:
      'Fallback analysis generated because AI service was unavailable. This score is estimated with keyword overlap between resume content and role requirements.',
    distribution: [
      { subject: 'Technical Depth', A: Math.min(score + 8, 100), B: 80, fullMark: 100 },
      { subject: 'Backend', A: score, B: 82, fullMark: 100 },
      { subject: 'Data', A: Math.max(score - 5, 20), B: 78, fullMark: 100 },
      { subject: 'Cloud', A: Math.max(score - 8, 20), B: 75, fullMark: 100 },
      { subject: 'Architecture', A: Math.max(score - 10, 20), B: 84, fullMark: 100 },
      { subject: 'Delivery', A: Math.max(score - 2, 20), B: 80, fullMark: 100 },
    ],
    benchmarking: [
      { name: 'Node.js', current: score, target: 85 },
      { name: 'MongoDB', current: Math.max(score - 6, 20), target: 80 },
      { name: 'System Design', current: Math.max(score - 10, 20), target: 88 },
      { name: 'API Design', current: Math.max(score - 4, 20), target: 82 },
      { name: 'DevOps', current: Math.max(score - 12, 20), target: 78 },
    ],
  };
}

function parseAiJson(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty AI response');
  }

  const trimmed = text.trim();
  const clean = trimmed.startsWith('```')
    ? trimmed.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim()
    : trimmed;

  return JSON.parse(clean);
}

async function callGeminiWithRetry({ resumeText, jobDescription }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Analyze this resume against role requirements and return strict JSON only.

Resume:\n${resumeText}\n
Role Requirements:\n${jobDescription}\n
Return JSON with keys:
- score: number (0-100)
- skills: [{ name: string, level: number (0-100), status: "mastered" | "developing" | "gap" }]
- reasoning: string
- distribution: [{ subject: string, A: number, B: number, fullMark: number }]
- benchmarking: [{ name: string, current: number, target: number }]`;

  let lastError = null;

  for (let attempt = 1; attempt <= aiMaxRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), aiTimeoutMs);

    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              skills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    level: { type: Type.NUMBER },
                    status: { type: Type.STRING, enum: ['mastered', 'developing', 'gap'] },
                  },
                  required: ['name', 'level', 'status'],
                },
              },
              reasoning: { type: Type.STRING },
              distribution: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    subject: { type: Type.STRING },
                    A: { type: Type.NUMBER },
                    B: { type: Type.NUMBER },
                    fullMark: { type: Type.NUMBER },
                  },
                  required: ['subject', 'A', 'B', 'fullMark'],
                },
              },
              benchmarking: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    current: { type: Type.NUMBER },
                    target: { type: Type.NUMBER },
                  },
                  required: ['name', 'current', 'target'],
                },
              },
            },
            required: ['score', 'skills', 'reasoning', 'distribution', 'benchmarking'],
          },
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);
      return parseAiJson(response?.text || '');
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;

      const shouldRetry = attempt < aiMaxRetries && isRetryableError(error);
      if (!shouldRetry) {
        break;
      }

      await sleep(400 * attempt);
    }
  }

  throw lastError || new Error('AI call failed after retries');
}

async function maybePersistAnalysis(doc) {
  if (!analysisCollection) {
    return;
  }

  await analysisCollection.insertOne(doc);
}

async function ensureCollectionIndexes() {
  if (!analysisCollection || !usersCollection) {
    return;
  }

  await usersCollection.createIndex({ email: 1 }, { unique: true });
  await analysisCollection.createIndex({ userId: 1, createdAt: -1 });
  await analysisCollection.createIndex({ createdAt: -1 });
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return sendError(res, 401, 'Authentication required', {});
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.auth = payload;
    return next();
  } catch {
    return sendError(res, 401, 'Invalid or expired token', {});
  }
}

function enforceUserScope(req, res, next) {
  const authenticatedUser = req.auth?.userId;
  const requestUser = ensureString(req.body?.userId || req.params?.userId);

  if (!authenticatedUser) {
    return sendError(res, 401, 'Authentication required', {});
  }

  if (!requestUser) {
    return sendError(res, 400, 'userId is required', {});
  }

  if (requestUser !== authenticatedUser) {
    return sendError(res, 403, 'User scope mismatch', {});
  }

  return next();
}

async function connectMongo() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('[DB] MONGODB_URI not set. Running without persistence.');
    return;
  }

  mongoClient = new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });
  await mongoClient.connect();

  const dbName = process.env.MONGODB_DB || 'nebula_ai';
  const db = mongoClient.db(dbName);

  usersCollection = db.collection('users');
  analysisCollection = db.collection('analysis_results');

  await ensureCollectionIndexes();
  console.log(`[DB] Connected to MongoDB database: ${dbName}`);
}

async function findUserByAuth(req) {
  const userId = ensureString(req.auth?.userId);
  const objectId = toObjectId(userId);

  if (!objectId || !usersCollection) {
    return null;
  }

  return usersCollection.findOne({ _id: objectId });
}

function mapAnalysis(doc) {
  return {
    id: String(doc._id),
    userId: doc.userId,
    resumeText: doc.resumeText,
    jobDescription: doc.jobDescription,
    result: doc.result,
    createdAt: doc.createdAt,
  };
}

app.get('/api/health', (_req, res) => {
  return sendSuccess(res, 'API is healthy', {
    mongoConnected: Boolean(analysisCollection && usersCollection),
  });
});

app.get('/', (_req, res) => {
  return sendSuccess(res, 'Onboard AI API server is running', {
    docs: {
      health: '/api/health',
      test: '/api/test',
    },
  });
});

app.get('/api/test', (_req, res) => {
  return sendSuccess(res, 'OK', {
    status: 'OK',
  });
});

app.post('/api/auth/signup', async (req, res, next) => {
  try {
    if (!usersCollection) {
      return sendError(res, 503, 'Database unavailable', {});
    }

    const name = ensureString(req.body?.name);
    const email = ensureString(req.body?.email).toLowerCase();
    const password = ensureString(req.body?.password);

    if (!name || !email || !password) {
      return sendError(res, 400, 'name, email and password are required', {});
    }

    if (!validateEmail(email)) {
      return sendError(res, 400, 'Invalid email format', {});
    }

    if (!validatePassword(password)) {
      return sendError(res, 400, 'Password must be at least 8 characters', {});
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, 'User already exists', {});
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const doc = {
      name,
      email,
      password: hashedPassword,
      provider: 'local',
      createdAt: new Date(),
    };

    const insertResult = await usersCollection.insertOne(doc);
    const user = { ...doc, _id: insertResult.insertedId };
    const token = issueToken(user);

    return sendSuccess(res, 'Signup successful', {
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    if (!usersCollection) {
      return sendError(res, 503, 'Database unavailable', {});
    }

    const email = ensureString(req.body?.email).toLowerCase();
    const password = ensureString(req.body?.password);

    if (!email || !password) {
      return sendError(res, 400, 'email and password are required', {});
    }

    if (!validateEmail(email)) {
      return sendError(res, 400, 'Invalid email format', {});
    }

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return sendError(res, 401, 'Invalid credentials', {});
    }

    if (user.provider !== 'local' || !user.password) {
      return sendError(res, 401, 'This account uses Google login', {});
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return sendError(res, 401, 'Invalid credentials', {});
    }

    const token = issueToken(user);

    return sendSuccess(res, 'Login successful', {
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/google', async (req, res, next) => {
  try {
    if (!usersCollection) {
      return sendError(res, 503, 'Database unavailable', {});
    }

    if (!googleClientId) {
      return sendError(res, 503, 'Google OAuth not configured', {});
    }

    const idToken = ensureString(req.body?.idToken);
    if (!idToken) {
      return sendError(res, 400, 'idToken is required', {});
    }

    const ticket = await googleOAuthClient.verifyIdToken({
      idToken,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    const email = ensureString(payload?.email).toLowerCase();
    const name = ensureString(payload?.name) || 'Google User';

    if (!email || !validateEmail(email)) {
      return sendError(res, 400, 'Google account email is invalid', {});
    }

    let user = await usersCollection.findOne({ email });

    if (!user) {
      const doc = {
        name,
        email,
        password: null,
        provider: 'google',
        googleSub: ensureString(payload?.sub),
        createdAt: new Date(),
      };
      const insertResult = await usersCollection.insertOne(doc);
      user = { ...doc, _id: insertResult.insertedId };
    }

    const token = issueToken(user);

    return sendSuccess(res, 'Google authentication successful', {
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return sendError(res, 401, 'Google authentication failed', {});
  }
});

app.get('/api/auth/me', requireAuth, async (req, res, next) => {
  try {
    if (!usersCollection) {
      return sendError(res, 503, 'Database unavailable', {});
    }

    const user = await findUserByAuth(req);
    if (!user) {
      return sendError(res, 404, 'User not found', {});
    }

    return sendSuccess(res, 'Authenticated user fetched', {
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/analyze', requireAuth, async (req, res, next) => {
  try {
    if (!analysisCollection) {
      return sendError(res, 503, 'Database unavailable', {});
    }

    const userId = ensureString(req.auth?.userId);
    const bodyUserId = ensureString(req.body?.userId);
    if (bodyUserId && bodyUserId !== userId) {
      return sendError(res, 403, 'User scope mismatch', {});
    }

    const resumeText = ensureString(req.body?.resumeText);
    const jobDescription = ensureString(req.body?.jobDescription || req.body?.roleRequirements);

    if (!resumeText || !jobDescription) {
      return sendError(res, 400, 'Resume and Job Description are required', {});
    }

    console.log('[REQ] /api/analyze body:', sanitizeBodyForLog({ ...req.body, userId }));

    let analysis;
    try {
      analysis = await callGeminiWithRetry({
        resumeText,
        jobDescription,
      });
    } catch (aiError) {
      console.error('[AI] Final failure, using fallback:', aiError?.stack || aiError);
      analysis = buildFallbackAnalysis(resumeText, jobDescription);
    }

    const doc = {
      userId,
      resumeText,
      jobDescription,
      result: analysis,
      createdAt: new Date(),
    };

    await maybePersistAnalysis(doc);

    return sendSuccess(res, 'Analysis completed', {
      analysis,
      createdAt: doc.createdAt,
    });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/analysis/history/:userId', requireAuth, enforceUserScope, async (req, res, next) => {
  try {
    if (!analysisCollection) {
      return sendError(res, 503, 'Database unavailable', { items: [] });
    }

    const userId = ensureString(req.params.userId);

    const docs = await analysisCollection.find({ userId }).sort({ createdAt: -1 }).toArray();

    return sendSuccess(res, 'History fetched', {
      items: docs.map(mapAnalysis),
    });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/history/:userId', requireAuth, enforceUserScope, async (req, res, next) => {
  try {
    if (!analysisCollection) {
      return sendError(res, 503, 'Database unavailable', { items: [] });
    }

    const userId = ensureString(req.params.userId);
    const docs = await analysisCollection.find({ userId }).sort({ createdAt: -1 }).toArray();

    return sendSuccess(res, 'History fetched', {
      items: docs.map(mapAnalysis),
    });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/analysis/latest/:userId', requireAuth, enforceUserScope, async (req, res, next) => {
  try {
    if (!analysisCollection) {
      return sendError(res, 503, 'Database unavailable', { latestAnalysis: null });
    }

    const userId = ensureString(req.params.userId);
    const [latestAnalysis] = await analysisCollection.find({ userId }).sort({ createdAt: -1 }).limit(1).toArray();

    return sendSuccess(res, 'Latest analysis fetched', {
      latestAnalysis: latestAnalysis ? mapAnalysis(latestAnalysis) : null,
    });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/dashboard/:userId', requireAuth, enforceUserScope, async (req, res, next) => {
  try {
    if (!analysisCollection) {
      return sendError(res, 503, 'Database unavailable', {
        totalAnalyses: 0,
        averageMatchScore: 0,
        latestAnalysis: null,
      });
    }

    const userId = ensureString(req.params.userId);

    const [latestAnalysis] = await analysisCollection.find({ userId }).sort({ createdAt: -1 }).limit(1).toArray();

    const grouped = await analysisCollection
      .aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: '$userId',
            totalAnalyses: { $sum: 1 },
            averageMatchScore: { $avg: '$result.score' },
          },
        },
      ])
      .toArray();

    const metrics = grouped[0] || { totalAnalyses: 0, averageMatchScore: 0 };

    return sendSuccess(res, 'Dashboard data fetched', {
      totalAnalyses: metrics.totalAnalyses || 0,
      averageMatchScore: Math.round(metrics.averageMatchScore || 0),
      latestAnalysis: latestAnalysis ? mapAnalysis(latestAnalysis) : null,
    });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/analysis/reset', requireAuth, async (req, res, next) => {
  try {
    if (!analysisCollection) {
      return sendError(res, 503, 'Database unavailable', {});
    }

    const userId = ensureString(req.auth?.userId);
    const deleteResult = await analysisCollection.deleteMany({ userId });

    return sendSuccess(res, 'All analysis data reset', {
      deletedCount: deleteResult.deletedCount || 0,
    });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/reset/:userId', requireAuth, enforceUserScope, async (req, res, next) => {
  try {
    if (!analysisCollection) {
      return sendError(res, 503, 'Database unavailable', {});
    }

    const userId = ensureString(req.params.userId);
    const deleteResult = await analysisCollection.deleteMany({ userId });

    return sendSuccess(res, 'All analysis data reset', {
      deletedCount: deleteResult.deletedCount || 0,
    });
  } catch (error) {
    return next(error);
  }
});

app.use((err, _req, res, _next) => {
  console.error('[UNCAUGHT]', err?.stack || err);

  if (res.headersSent) {
    return;
  }

  if (err instanceof SyntaxError && err?.status === 400 && 'body' in err) {
    return sendError(res, 400, 'Malformed JSON body', {});
  }

  return sendError(res, 500, 'Internal server error', {});
});

const server = app.listen(port, async () => {
  try {
    await connectMongo();
  } catch (error) {
    console.error('[DB] Mongo connection failed. Continuing without DB:', error?.stack || error);
  }

  console.log(`[API] Server running on http://localhost:${port}`);
});

const shutdown = async () => {
  console.log('[API] Shutting down...');
  server.close();

  if (mongoClient) {
    await mongoClient.close();
  }

  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
