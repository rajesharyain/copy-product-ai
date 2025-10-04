# 🚀 Sales Page Generator Setup Guide

## Overview
I've created a complete Python Flask web application that scrapes product details from any URL and generates compelling sales landing pages. The app is now integrated into your existing React application with a new "Sales Page Generator" navigation tab.

## 📁 Project Structure
```
copy-product-ai/
├── scraper-app/                 # New Flask application
│   ├── app.py                  # Main Flask app with scraper & generator
│   ├── requirements.txt        # Python dependencies
│   ├── run.py                 # Python startup script
│   ├── run.bat                # Windows batch file
│   ├── run.sh                 # Linux/Mac shell script
│   ├── README.md              # Detailed documentation
│   └── templates/
│       ├── index.html         # Homepage with URL input
│       └── results.html       # Results page with download options
├── src/
│   └── App.jsx                # Updated with new navigation
└── SCRAPER_SETUP.md           # This file
```

## 🚀 Quick Start

### Option 1: Windows (Recommended)
1. **Open Command Prompt or PowerShell**
2. **Navigate to the scraper-app directory:**
   ```cmd
   cd scraper-app
   ```
3. **Run the batch file:**
   ```cmd
   run.bat
   ```

### Option 2: Cross-Platform
1. **Navigate to scraper-app directory:**
   ```bash
   cd scraper-app
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the Flask app:**
   ```bash
   python app.py
   ```

### Option 3: Using the Python script
```bash
cd scraper-app
python run.py
```

## 🌐 Accessing the Application

### Flask App (Standalone)
- **URL:** http://localhost:5000
- **Features:** Complete scraping and sales page generation

### React App (Integrated)
- **URL:** http://localhost:5173 (your existing Vite dev server)
- **New Tab:** "Sales Page Generator" - embeds the Flask app

## ✨ Features Implemented

### 🎯 Core Functionality
- ✅ **Smart Product Scraping** - Extracts title, price, description, images
- ✅ **Fallback System** - Handles missing data with smart defaults
- ✅ **AI Copywriting** - Generates compelling, benefit-driven sales copy
- ✅ **Modern Design** - Beautiful Bootstrap-styled landing pages
- ✅ **Mobile Responsive** - Works perfectly on all devices
- ✅ **Download Ready** - Complete HTML files ready to deploy

### 🎨 Generated Sales Page Features
- **Hero Section** - Eye-catching title, image, and price
- **Compelling Copy** - Benefit-driven descriptions
- **Social Proof** - Trust indicators and guarantees
- **Call-to-Action** - Prominent order buttons
- **Urgency Elements** - Limited stock indicators
- **Guarantee Section** - Money-back guarantee
- **Modern Animations** - Smooth transitions and effects

### 🔧 Technical Features
- **Multiple Selectors** - Works with various e-commerce sites
- **Error Handling** - Graceful fallbacks for missing data
- **Session Management** - Secure data handling
- **File Management** - Automatic HTML file generation
- **Preview System** - Live preview of generated pages

## 🎯 How to Use

1. **Start the Flask App:**
   ```bash
   cd scraper-app
   python app.py
   ```

2. **Open your React app:**
   ```bash
   npm run dev
   ```

3. **Navigate to "Sales Page Generator" tab**

4. **Enter any product URL** (Amazon, AliExpress, eBay, etc.)

5. **Click "Generate Sales Page"**

6. **Preview and download** your compelling sales page!

## 🌍 Supported Websites

The scraper works with most e-commerce websites:
- Amazon
- AliExpress  
- eBay
- Shopify stores
- WooCommerce sites
- And many more!

## 🎨 Customization Options

### Modify Sales Copy
Edit the `SalesPageGenerator` class in `app.py` to:
- Change headline templates
- Modify benefit lists
- Update call-to-action text
- Add your brand voice

### Styling Changes
The generated HTML uses Bootstrap 5 with custom CSS:
- Modify colors in the `<style>` section
- Add your own CSS classes
- Include your branding elements

### Add More Fields
Extend the scraper to capture:
- Product reviews
- Shipping information
- Product specifications
- Related products

## 🔧 Troubleshooting

### Flask App Won't Start
```bash
# Check Python version (3.7+ required)
python --version

# Install dependencies manually
pip install Flask requests beautifulsoup4 lxml Werkzeug

# Run with debug mode
python app.py
```

### Scraping Issues
- **URL not accessible:** Check if the URL is public and accessible
- **Missing data:** The app includes fallback values for missing fields
- **Rate limiting:** Some sites may block rapid requests

### Integration Issues
- **Iframe not loading:** Ensure Flask app is running on port 5000
- **CORS errors:** The Flask app includes proper CORS headers
- **Styling conflicts:** The iframe isolates the Flask app styling

## 📊 Example Generated Sales Page

The app generates professional sales pages with:
- **Compelling headlines** like "🚀 [Product] - Limited Time Offer!"
- **Benefit-driven copy** highlighting key features
- **Trust indicators** like "30-Day Money-Back Guarantee"
- **Urgency elements** like "Only 3 left in stock!"
- **Strong CTAs** like "👉 Order Now - Limited Stock!"

## 🎉 Success!

Your complete sales page generator is now ready! The Flask app provides:
- Professional scraping capabilities
- AI-powered copywriting
- Beautiful, responsive design
- Easy download and deployment
- Integration with your existing React app

Start generating compelling sales pages in minutes! 🚀
