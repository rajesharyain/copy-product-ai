@echo off
echo 🐍 Setting up Python Web Scraper
echo ================================

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.7+ first.
    pause
    exit /b 1
)

echo ✅ Python found
python --version

REM Check if pip is installed
pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pip is not installed. Please install pip first.
    pause
    exit /b 1
)

echo ✅ pip found
pip --version

REM Install Python dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

REM Test the Python scraper
echo 🧪 Testing Python scraper...
python -c "import requests, bs4, selenium; print('✅ All Python dependencies are working!')"

echo.
echo 🎉 Python scraper setup complete!
echo.
echo Usage:
echo   The Python scraper will be used automatically when available.
echo   If Python dependencies are missing, the system will fall back to Node.js scrapers.
echo.
echo To test manually:
echo   python scrapers/python_scraper.py
echo.
pause

