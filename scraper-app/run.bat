@echo off
echo 🎯 Product Scraper ^& Sales Page Generator
echo ================================================

echo 📦 Installing requirements...
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install requirements
    pause
    exit /b 1
)

echo ✅ Requirements installed successfully
echo.
echo 🚀 Starting Flask application...
echo 📍 The app will be available at: http://localhost:5000
echo 🛑 Press Ctrl+C to stop the server
echo --------------------------------------------------

python app.py

pause
