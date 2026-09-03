@echo off
start "Battery Credit Backend" cmd /k "cd /d %~dp0backend && npm install && npm run dev"
start "Battery Credit Frontend" cmd /k "cd /d %~dp0 && npm install && npm run dev"
echo Backend: http://localhost:8000
 echo Frontend: http://localhost:5173
