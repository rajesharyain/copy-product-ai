# Product Scraper & Sales Page Generator

A Python Flask web application that scrapes product details from any URL and generates compelling sales landing pages.

## Features

- 🚀 **Smart Product Scraping**: Automatically extracts product title, price, description, and images
- ✨ **AI-Powered Copywriting**: Generates compelling, benefit-driven sales copy
- 🎨 **Modern Design**: Beautiful, responsive landing pages with Bootstrap styling
- 📱 **Mobile-Friendly**: Optimized for all devices
- 💾 **Download Ready**: Get complete HTML files ready to deploy
- 🔄 **Fallback System**: Handles missing data with smart defaults

## Installation

1. **Clone or navigate to the scraper-app directory:**
   ```bash
   cd scraper-app
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask application:**
   ```bash
   python app.py
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:5000
   ```

## Usage

1. **Enter a Product URL**: Paste any product page URL (Amazon, AliExpress, eBay, etc.)
2. **Click Generate**: The app will scrape the product details and create a sales page
3. **Preview & Download**: View the generated page and download the HTML file
4. **Customize**: Edit the HTML file to add your branding or modify the content

## Supported Websites

The scraper works with most e-commerce websites including:
- Amazon
- AliExpress
- eBay
- Shopify stores
- WooCommerce sites
- And many more!

## Generated Sales Page Features

- **Hero Section**: Eye-catching title, image, and price
- **Compelling Copy**: Benefit-driven descriptions
- **Social Proof**: Trust indicators and guarantees
- **Call-to-Action**: Prominent order buttons
- **Mobile Responsive**: Looks great on all devices
- **Modern Styling**: Professional design with animations

## File Structure

```
scraper-app/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/
│   ├── index.html        # Homepage template
│   └── results.html      # Results page template
└── static/               # Generated sales pages (created automatically)
```

## Customization

You can easily customize the generated sales pages by:

1. **Modifying the HTML template** in `app.py` (SalesPageGenerator class)
2. **Adding your own CSS** or JavaScript
3. **Changing the copywriting logic** to match your brand voice
4. **Adding more product fields** to scrape

## Troubleshooting

- **URL not working**: Make sure the URL is accessible and contains product information
- **Missing data**: The app includes fallback values for missing product details
- **Styling issues**: Ensure you have an internet connection for Bootstrap CDN

## License

This project is open source and available under the MIT License.
