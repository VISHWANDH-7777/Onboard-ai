@echo off
setlocal

set "ROOT=%~dp0"
cd /d "%ROOT%"

echo ====================================================
echo Starting NEBULA AI full stack services...
echo ====================================================

if not exist "%ROOT%\.venv\Scripts\python.exe" (
  echo [ERROR] Python virtual environment not found at .venv\Scripts\python.exe
  echo Create it first, then install ai_engine requirements.
  pause
  exit /b 1
)

start "NEBULA AI Engine" cmd /k "cd /d "%ROOT%" && "%ROOT%\.venv\Scripts\python.exe" -m uvicorn main:app --app-dir ai_engine --host 0.0.0.0 --port 8000"
start "NEBULA Backend" cmd /k "cd /d "%ROOT%" && npm run dev:backend"
start "NEBULA Frontend" cmd /k "cd /d "%ROOT%" && npm run dev"

echo.
echo Services launched in separate windows:
echo - AI Engine:  http://127.0.0.1:8000/health
echo - Backend:    http://127.0.0.1:4000/health
echo - Frontend:   http://localhost:3000
echo.
echo Close each service window to stop that service.

endlocal
