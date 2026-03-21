# NEBULA AI Engine (Custom Model)

This service provides a custom AI model for adaptive onboarding analysis.

## Stack
- Python
- FastAPI
- scikit-learn
- nltk
- numpy
- pandas

## Run
1. Create and activate a Python environment.
2. Install dependencies:
   pip install -r requirements.txt
3. Start service:
   uvicorn main:app --host 0.0.0.0 --port 8000

## Dataset
The dataset is generated in code (`dataset_builder.py`) and includes:
- 120+ job roles
- 560 skill catalog entries
- 700+ mapped skill references
- skill relationship links

## Core endpoints
- GET /health
- GET /dataset/stats
- POST /analyze
