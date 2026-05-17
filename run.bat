@echo off
cd /d "%~dp0"

echo Starting Mini Anime List...
echo.

docker compose up --build

pause