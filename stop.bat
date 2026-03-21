@echo off
setlocal EnableDelayedExpansion

set "PORTS=3000 4000 8000"
set "KILLED=0"

echo ====================================================
echo Stopping NEBULA AI services...
echo ====================================================

for %%P in (%PORTS%) do (
  for /f "tokens=5" %%I in ('netstat -ano ^| findstr :%%P ^| findstr LISTENING') do (
    if not "%%I"=="0" (
      echo [INFO] Stopping PID %%I on port %%P
      taskkill /PID %%I /F >nul 2>nul
      if !errorlevel! EQU 0 (
        set /a KILLED+=1
      )
    )
  )
)

if %KILLED% EQU 0 (
  echo [INFO] No matching running services found on ports 3000, 4000, 8000.
) else (
  echo [INFO] Stopped %KILLED% process(es).
)

echo Done.
endlocal
