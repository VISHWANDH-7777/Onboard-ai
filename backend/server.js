import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDatabase } from './config/db.js';
import { authRouter } from './routes/auth.js';
import { dashboardRouter } from './routes/dashboard.js';
import { analyzeRouter } from './routes/analyze.js';
import { resultsRouter } from './routes/results.js';
import { learningRouter } from './routes/learning.js';
import { careerRouter } from './routes/career.js';
import { exportRouter } from './routes/export.js';

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'nebula-backend' });
});

app.use('/reports', express.static(path.resolve('backend', 'exports')));
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/result', resultsRouter);
app.use('/api/learning', learningRouter);
app.use('/api/career', careerRouter);
app.use('/api/export', exportRouter);

app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ message: 'Internal server error' });
});

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`[Backend] Running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('[Startup] Failed to boot server', error.message);
    process.exit(1);
  });
