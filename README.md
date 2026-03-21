# NEBULA AI - Adaptive Onboarding Engine

Full-stack implementation with:
- Frontend: React + Vite
- Backend: Node.js + Express + MongoDB
- AI Engine: Python + FastAPI + scikit-learn + nltk + numpy + pandas

No external generative AI APIs are used.

## Architecture
- src/: Frontend pages and API integration
- backend/: Express APIs, JWT auth, MongoDB persistence, PDF export
- ai_engine/: Custom dataset + model + analysis microservice

## Backend APIs
- POST /api/auth/login
- GET /api/dashboard/:userId
- POST /api/analyze
- POST /api/analyze/:analysisId/rerun
- GET /api/result/:analysisId
- GET /api/result/history/:userId
- GET /api/result/compare/:analysisA/:analysisB
- GET /api/learning/:analysisId
- GET /api/career/:analysisId
- GET /api/export/:analysisId

## Python AI APIs
- GET /health
- GET /dataset/stats
- POST /analyze

## Dataset (custom generated)
- 120+ job roles
- 560 skills in catalog
- 700+ mapped skill assignments
- skill relationship graph

## Environment Variables
Create .env with:

PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/nebula_ai
JWT_SECRET=replace_me
PYTHON_SERVICE_URL=http://127.0.0.1:8000
PUBLIC_BASE_URL=http://localhost:4000
VITE_API_BASE_URL=http://localhost:4000

## Run
1. Install Node deps:
   npm install
2. Start backend:
   npm run dev:backend
3. Start frontend:
   npm run dev
4. Start Python AI service:
   cd ai_engine
   pip install -r requirements.txt
   uvicorn main:app --host 0.0.0.0 --port 8000

## Notes
- Login auto-creates a user on first valid email/password.
- Analysis supports text input and file upload parsing (txt/pdf/docx).
- Export endpoint generates and saves PDF reports under backend/exports.
