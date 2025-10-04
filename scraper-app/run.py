#!/usr/bin/env python3
"""
Simple script to run the Flask scraper app
"""

import os
import sys
import subprocess

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version.split()[0]} detected")

def install_requirements():
    """Install required packages"""
    print("📦 Installing requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install requirements")
        sys.exit(1)

def run_flask_app():
    """Run the Flask application"""
    print("🚀 Starting Flask application...")
    print("📍 The app will be available at: http://localhost:5000")
    print("🛑 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Import and run the app
        from app import app
        app.run(debug=True, port=5000, host='0.0.0.0')
    except KeyboardInterrupt:
        print("\n👋 Flask app stopped")
    except Exception as e:
        print(f"❌ Error starting Flask app: {e}")
        sys.exit(1)

if __name__ == "__main__":
    print("🎯 Product Scraper & Sales Page Generator")
    print("=" * 50)
    
    check_python_version()
    
    # Check if requirements.txt exists
    if not os.path.exists("requirements.txt"):
        print("❌ requirements.txt not found")
        sys.exit(1)
    
    # Install requirements
    install_requirements()
    
    # Run the Flask app
    run_flask_app()
