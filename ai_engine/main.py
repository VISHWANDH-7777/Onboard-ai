from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel, Field

from model import NebulaAdaptiveModel, build_dataset_preview


app = FastAPI(title='NEBULA AI Engine', version='1.0.0')
model = NebulaAdaptiveModel()


class AnalyzeRequest(BaseModel):
  resume_text: str = Field(min_length=1)
  job_description: str = Field(min_length=1)
  target_role: str = ''
  experience_level: str = 'Intermediate'


@app.get('/health')
def health_check():
  return {'status': 'ok', 'service': 'nebula-ai-engine'}


@app.get('/dataset/stats')
def dataset_stats():
  return build_dataset_preview()


@app.post('/analyze')
def analyze(payload: AnalyzeRequest):
  print('[AI] Incoming analyze request', payload.model_dump())
  result = model.analyze(
    resume_text=payload.resume_text,
    job_description=payload.job_description,
    target_role=payload.target_role,
    experience_level=payload.experience_level,
  )
  return result.__dict__
