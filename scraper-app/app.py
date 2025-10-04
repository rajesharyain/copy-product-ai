from flask import Flask, render_template, request, redirect, url_for, flash, send_file
import requests
from bs4 import BeautifulSoup
import os
from datetime import datetime
import re
from urllib.parse import urljoin, urlparse
import json

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

# Create templates and static directories if they don't exist
os.makedirs('templates', exist_ok=True)
os.makedirs('static/css', exist_ok=True)
os.makedirs('static/js', exist_ok=True)

class ProductScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def scrape_product(self, url):
        """Scrape product details from a given URL"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract product information
            product_data = {
                'title': self._extract_title(soup),
                'price': self._extract_price(soup),
                'description': self._extract_description(soup),
                'image': self._extract_main_image(soup, url),
                'url': url,
                'scraped_at': datetime.now().isoformat()
            }
            
            return product_data
            
        except requests.RequestException as e:
            raise Exception(f"Failed to fetch URL: {str(e)}")
        except Exception as e:
            raise Exception(f"Failed to parse product data: {str(e)}")
    
    def _extract_title(self, soup):
        """Extract product title with multiple fallbacks"""
        selectors = [
            'h1[data-testid="product-title"]',
            'h1.product-title',
            'h1.title',
            'h1',
            '.product-name',
            '.product-title',
            '[data-testid="product-title"]',
            'title'
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element and element.get_text(strip=True):
                return element.get_text(strip=True)
        
        return "Amazing Product"
    
    def _extract_price(self, soup):
        """Extract product price with multiple fallbacks"""
        selectors = [
            '[data-testid="price"]',
            '.price',
            '.product-price',
            '.current-price',
            '.price-current',
            '[class*="price"]'
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                price_text = element.get_text(strip=True)
                # Extract price using regex
                price_match = re.search(r'[\$€£¥₹]\s*[\d,]+\.?\d*', price_text)
                if price_match:
                    return price_match.group()
        
        return "Contact us for pricing"
    
    def _extract_description(self, soup):
        """Extract product description with multiple fallbacks"""
        selectors = [
            '[data-testid="product-description"]',
            '.product-description',
            '.description',
            '.product-details',
            '.product-info',
            'meta[name="description"]'
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                if element.name == 'meta':
                    desc = element.get('content', '')
                else:
                    desc = element.get_text(strip=True)
                
                if desc and len(desc) > 20:
                    return desc[:500] + "..." if len(desc) > 500 else desc
        
        return "Discover this incredible product that will transform your experience. High-quality materials, innovative design, and exceptional value make this a must-have item."
    
    def _extract_main_image(self, soup, base_url):
        """Extract main product image with multiple fallbacks"""
        selectors = [
            '[data-testid="product-image"] img',
            '.product-image img',
            '.main-image img',
            '.hero-image img',
            '.product-photo img',
            'img[alt*="product"]',
            'img[alt*="main"]',
            'img'
        ]
        
        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                img_src = element.get('src') or element.get('data-src') or element.get('data-lazy')
                if img_src:
                    # Convert relative URLs to absolute
                    if img_src.startswith('//'):
                        img_src = 'https:' + img_src
                    elif img_src.startswith('/'):
                        parsed_url = urlparse(base_url)
                        img_src = f"{parsed_url.scheme}://{parsed_url.netloc}{img_src}"
                    elif not img_src.startswith('http'):
                        img_src = urljoin(base_url, img_src)
                    
                    return img_src
        
        return "https://via.placeholder.com/400x300?text=Product+Image"

class SalesPageGenerator:
    def __init__(self):
        self.scraper = ProductScraper()
    
    def generate_sales_copy(self, product_data):
        """Generate compelling sales copy from product data"""
        title = product_data['title']
        price = product_data['price']
        description = product_data['description']
        
        # Generate compelling headline
        headlines = [
            f"🚀 {title} - Limited Time Offer!",
            f"✨ Transform Your Life with {title}",
            f"🔥 Get {title} Before It's Gone!",
            f"💎 Premium {title} - Exclusive Deal",
            f"⚡ {title} - The Game Changer You Need"
        ]
        
        headline = headlines[0]  # You could randomize this
        
        # Generate benefits-driven description
        benefits = [
            "✅ Premium Quality Materials",
            "✅ Fast & Secure Shipping",
            "✅ 30-Day Money-Back Guarantee",
            "✅ 24/7 Customer Support",
            "✅ Limited Stock Available"
        ]
        
        # Generate compelling call-to-action
        ctas = [
            "👉 Order Now - Limited Stock!",
            "🔥 Get Yours Today!",
            "⚡ Secure Your Order Now",
            "💎 Claim Your Discount",
            "🚀 Buy Now & Save!"
        ]
        
        cta = ctas[0]
        
        return {
            'headline': headline,
            'description': description,
            'benefits': benefits,
            'call_to_action': cta,
            'urgency_text': "⏰ Only 3 left in stock!",
            'guarantee_text': "🛡️ 30-Day Money-Back Guarantee"
        }
    
    def create_sales_page_html(self, product_data, sales_copy):
        """Generate complete HTML sales page"""
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{sales_copy['headline']}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .hero-section {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 80px 0;
        }}
        .product-image {{
            max-width: 100%;
            height: auto;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }}
        .price-tag {{
            background: #ff6b6b;
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 2rem;
            font-weight: bold;
            display: inline-block;
            margin: 20px 0;
        }}
        .cta-button {{
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            border: none;
            padding: 20px 50px;
            font-size: 1.5rem;
            font-weight: bold;
            border-radius: 50px;
            color: white;
            text-decoration: none;
            display: inline-block;
            margin: 30px 0;
            transition: transform 0.3s ease;
        }}
        .cta-button:hover {{
            transform: scale(1.05);
            color: white;
        }}
        .benefit-item {{
            background: #f8f9fa;
            padding: 20px;
            margin: 10px 0;
            border-radius: 10px;
            border-left: 5px solid #28a745;
        }}
        .urgency-banner {{
            background: #ff4757;
            color: white;
            padding: 15px;
            text-align: center;
            font-weight: bold;
            animation: pulse 2s infinite;
        }}
        @keyframes pulse {{
            0% {{ opacity: 1; }}
            50% {{ opacity: 0.7; }}
            100% {{ opacity: 1; }}
        }}
        .guarantee-section {{
            background: #e8f5e8;
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
        }}
    </style>
</head>
<body>
    <!-- Urgency Banner -->
    <div class="urgency-banner">
        <i class="fas fa-clock"></i> {sales_copy['urgency_text']}
    </div>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-4">{sales_copy['headline']}</h1>
                    <p class="lead mb-4">{sales_copy['description']}</p>
                    <div class="price-tag">{product_data['price']}</div>
                    <br>
                    <a href="#order" class="cta-button">
                        <i class="fas fa-shopping-cart"></i> {sales_copy['call_to_action']}
                    </a>
                </div>
                <div class="col-lg-6 text-center">
                    <img src="{product_data['image']}" alt="{product_data['title']}" class="product-image">
                </div>
            </div>
        </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <h2 class="text-center mb-5">Why Choose This Product?</h2>
                    {''.join([f'<div class="benefit-item"><i class="fas fa-check-circle text-success me-2"></i>{benefit}</div>' for benefit in sales_copy['benefits']])}
                </div>
            </div>
        </div>
    </section>

    <!-- Guarantee Section -->
    <section class="py-5">
        <div class="container">
            <div class="guarantee-section text-center">
                <h3><i class="fas fa-shield-alt text-success"></i> {sales_copy['guarantee_text']}</h3>
                <p class="lead">We're so confident you'll love this product that we offer a full 30-day money-back guarantee. No questions asked!</p>
            </div>
        </div>
    </section>

    <!-- Final CTA Section -->
    <section id="order" class="py-5 bg-light">
        <div class="container text-center">
            <h2 class="mb-4">Ready to Transform Your Life?</h2>
            <p class="lead mb-4">Don't miss out on this incredible opportunity!</p>
            <a href="#order" class="cta-button">
                <i class="fas fa-rocket"></i> {sales_copy['call_to_action']}
            </a>
            <p class="mt-3 text-muted">Secure checkout • Fast delivery • 30-day guarantee</p>
        </div>
    </section>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
        """
        return html_content

# Initialize the generator
generator = SalesPageGenerator()

@app.route('/')
def index():
    """Homepage with URL input form"""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    """Generate sales page from product URL"""
    url = request.form.get('url', '').strip()
    
    if not url:
        flash('Please enter a product URL', 'error')
        return redirect(url_for('index'))
    
    try:
        # Scrape product data
        product_data = generator.scraper.scrape_product(url)
        
        # Generate sales copy
        sales_copy = generator.generate_sales_copy(product_data)
        
        # Create sales page HTML
        sales_page_html = generator.create_sales_page_html(product_data, sales_copy)
        
        # Save to file
        filename = f"sales_page_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
        filepath = os.path.join('static', filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(sales_page_html)
        
        # Store data in session for results page
        session_data = {
            'product_data': product_data,
            'sales_copy': sales_copy,
            'filename': filename,
            'filepath': filepath
        }
        
        return render_template('results.html', **session_data)
        
    except Exception as e:
        flash(f'Error generating sales page: {str(e)}', 'error')
        return redirect(url_for('index'))

@app.route('/download/<filename>')
def download_file(filename):
    """Download the generated sales page"""
    filepath = os.path.join('static', filename)
    if os.path.exists(filepath):
        return send_file(filepath, as_attachment=True)
    else:
        flash('File not found', 'error')
        return redirect(url_for('index'))

@app.route('/preview/<filename>')
def preview_file(filename):
    """Preview the generated sales page"""
    filepath = os.path.join('static', filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    else:
        return "File not found", 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
