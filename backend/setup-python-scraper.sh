#!/bin/bash

echo "🐍 Setting up Python Web Scraper"
echo "================================"

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.7+ first."
    exit 1
fi

echo "✅ Python found: $(python --version)"

# Check if pip is installed
if ! command -v pip &> /dev/null; then
    echo "❌ pip is not installed. Please install pip first."
    exit 1
fi

echo "✅ pip found: $(pip --version)"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Check if Chrome/Chromium is available for Selenium
echo "🔍 Checking for Chrome/Chromium..."
if command -v google-chrome &> /dev/null; then
    echo "✅ Google Chrome found"
elif command -v chromium-browser &> /dev/null; then
    echo "✅ Chromium found"
elif command -v chromium &> /dev/null; then
    echo "✅ Chromium found"
else
    echo "⚠️ Chrome/Chromium not found. Selenium will use system default."
fi

# Test the Python scraper
echo "🧪 Testing Python scraper..."
python -c "
import requests, bs4, selenium
print('✅ All Python dependencies are working!')
"

echo ""
echo "🎉 Python scraper setup complete!"
echo ""
echo "Usage:"
echo "  The Python scraper will be used automatically when available."
echo "  If Python dependencies are missing, the system will fall back to Node.js scrapers."
echo ""
echo "To test manually:"
echo "  python scrapers/python_scraper.py"

