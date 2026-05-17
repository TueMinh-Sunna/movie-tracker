@echo off
cd /d "%~dp0"

echo Stopping Mini Anime List...
echo.

docker compose down

pause