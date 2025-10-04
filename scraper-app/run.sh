#!/bin/bash

echo "🎯 Product Scraper & Sales Page Generator"
echo "================================================"

echo "📦 Installing requirements..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install requirements"
    exit 1
fi

echo "✅ Requirements installed successfully"
echo ""
echo "🚀 Starting Flask application..."
echo "📍 The app will be available at: http://localhost:5000"
echo "🛑 Press Ctrl+C to stop the server"
echo "--------------------------------------------------"

python app.py
