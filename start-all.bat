@echo off
echo ====================================================
echo  Starting ONe AI Studio (Frontend + Backend)
echo ====================================================
start "ONe Backend (Port 5000)" cmd /k "cd backend && npm run dev"
start "ONe Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"
