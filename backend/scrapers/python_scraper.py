#!/usr/bin/env python3
"""
Python Web Scraper for Product Data
Alternative scraper using requests, BeautifulSoup, and Selenium for better data extraction
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from urllib.parse import urlparse, urljoin
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class ProductScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
    
    def scrape_product(self, url):
        """Main scraping function that determines platform and delegates"""
        domain = urlparse(url).netloc.lower()
        
        if 'aliexpress' in domain:
            return self.scrape_aliexpress(url)
        elif 'amazon' in domain:
            return self.scrape_amazon(url)
        elif 'ebay' in domain:
            return self.scrape_ebay(url)
        else:
            return self.scrape_generic(url)
    
    def scrape_aliexpress(self, url):
        """AliExpress scraper using Selenium for dynamic content"""
        # print(f"Scraping AliExpress URL: {url}")
        
        # Setup Chrome options
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
        
        driver = None
        try:
            driver = webdriver.Chrome(options=chrome_options)
            driver.get(url)
            
            # Wait for page to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Extract product data
            product_data = {
                'id': f"aliexpress_{int(time.time())}",
                'title': self._extract_title_aliexpress(driver),
                'brand': 'AliExpress',
                'price': self._extract_price_aliexpress(driver),
                'description': self._extract_description_aliexpress(driver),
                'images': self._extract_images_aliexpress(driver),
                'reviews': self._extract_reviews_aliexpress(driver),
                'availability': self._extract_availability_aliexpress(driver),
                'source': {
                    'url': url,
                    'platform': 'AliExpress',
                    'scraped_at': time.strftime('%Y-%m-%dT%H:%M:%S.000Z', time.gmtime())
                }
            }
            
            return product_data
            
        except Exception as e:
            # print(f"Error scraping AliExpress: {str(e)}")
            return self._create_fallback_data(url, 'AliExpress', str(e))
        finally:
            if driver:
                driver.quit()
    
    def _extract_title_aliexpress(self, driver):
        """Extract product title from AliExpress"""
        selectors = [
            'h1[data-pl="product-title"]',
            '.product-title-text',
            'h1.product-title',
            'h1',
            '.title-text'
        ]
        
        for selector in selectors:
            try:
                element = driver.find_element(By.CSS_SELECTOR, selector)
                if element.text.strip():
                    return element.text.strip()
            except NoSuchElementException:
                continue
        
        return "AliExpress Product"
    
    def _extract_price_aliexpress(self, driver):
        """Extract price from AliExpress"""
        selectors = [
            '.notranslate',
            '[data-pl="product-price"]',
            '.price-current',
            '.price',
            '.product-price'
        ]
        
        for selector in selectors:
            try:
                element = driver.find_element(By.CSS_SELECTOR, selector)
                price_text = element.text.strip()
                if price_text:
                    # Extract numeric value
                    price_match = re.search(r'[\d,]+\.?\d*', price_text.replace(',', ''))
                    if price_match:
                        price_value = float(price_match.group())
                        currency = 'USD' if '$' in price_text else 'USD'
                        return {
                            'current': price_value,
                            'original': price_value,
                            'currency': currency,
                            'discount_percentage': 0
                        }
            except NoSuchElementException:
                continue
        
        return {'current': 0, 'original': 0, 'currency': 'USD', 'discount_percentage': 0}
    
    def _extract_description_aliexpress(self, driver):
        """Extract product description from AliExpress"""
        selectors = [
            '.product-description',
            '[data-pl="product-description"]',
            '.product-detail-description',
            '.description'
        ]
        
        for selector in selectors:
            try:
                element = driver.find_element(By.CSS_SELECTOR, selector)
                if element.text.strip():
                    return element.text.strip()[:500]  # Limit length
            except NoSuchElementException:
                continue
        
        return "Product description not available"
    
    def _extract_images_aliexpress(self, driver):
        """Extract product images from AliExpress"""
        images = []
        
        # Try to find main product images
        selectors = [
            '.images-view-item img',
            '.product-image img',
            '.gallery-image img',
            'img[src*="alicdn"]'
        ]
        
        for selector in selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                for img in elements[:5]:  # Limit to 5 images
                    src = img.get_attribute('src') or img.get_attribute('data-src')
                    if src and src.startswith('http'):
                        images.append({
                            'url': src,
                            'alt': img.get_attribute('alt') or 'Product Image',
                            'is_primary': len(images) == 0
                        })
            except NoSuchElementException:
                continue
        
        return images if images else [{'url': 'https://via.placeholder.com/400x300?text=No+Image', 'alt': 'No Image', 'is_primary': True}]
    
    def _extract_reviews_aliexpress(self, driver):
        """Extract reviews from AliExpress"""
        try:
            # Try to find review elements
            review_elements = driver.find_elements(By.CSS_SELECTOR, '.review-item, .feedback-item')
            reviews = []
            
            for review in review_elements[:3]:  # Limit to 3 reviews
                try:
                    rating = review.find_element(By.CSS_SELECTOR, '.star-view, .rating').text.strip()
                    comment = review.find_element(By.CSS_SELECTOR, '.buyer-feedback').text.strip()
                    author = review.find_element(By.CSS_SELECTOR, '.buyer-name').text.strip()
                    
                    reviews.append({
                        'rating': rating,
                        'comment': comment,
                        'author': author
                    })
                except NoSuchElementException:
                    continue
            
            return {
                'average_rating': 0,
                'total_reviews': len(reviews),
                'recent_reviews': reviews
            }
        except NoSuchElementException:
            return {'average_rating': 0, 'total_reviews': 0, 'recent_reviews': []}
    
    def _extract_availability_aliexpress(self, driver):
        """Extract availability info from AliExpress"""
        return {
            'in_stock': True,
            'stock_quantity': 999,
            'shipping_info': {
                'free_shipping': True,
                'estimated_delivery': '7-15 business days',
                'shipping_cost': 0
            }
        }
    
    def scrape_amazon(self, url):
        """Amazon scraper placeholder"""
        return self._create_fallback_data(url, 'Amazon', 'Amazon scraping not implemented')
    
    def scrape_ebay(self, url):
        """eBay scraper placeholder"""
        return self._create_fallback_data(url, 'eBay', 'eBay scraping not implemented')
    
    def scrape_generic(self, url):
        """Generic scraper using requests and BeautifulSoup"""
        # print(f"Scraping generic URL: {url}")
        
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title
            title = soup.find('title')
            title_text = title.text.strip() if title else 'Generic Product'
            
            # Extract description
            desc_meta = soup.find('meta', attrs={'name': 'description'})
            description = desc_meta.get('content', '') if desc_meta else ''
            
            # Extract price
            price_selectors = [
                '[itemprop="price"]',
                '.price',
                '.product-price',
                '[class*="price"]'
            ]
            
            price_text = '$0.00'
            for selector in price_selectors:
                price_elem = soup.select_one(selector)
                if price_elem and price_elem.text.strip():
                    price_text = price_elem.text.strip()
                    break
            
            # Extract images
            images = []
            img_tags = soup.find_all('img', src=True)[:5]
            for img in img_tags:
                src = img.get('src')
                if src and src.startswith('http'):
                    images.append({
                        'url': src,
                        'alt': img.get('alt', 'Product Image'),
                        'is_primary': len(images) == 0
                    })
            
            return {
                'id': f"generic_{int(time.time())}",
                'title': title_text,
                'brand': urlparse(url).netloc,
                'price': {
                    'current': 0,
                    'original': 0,
                    'currency': 'USD',
                    'discount_percentage': 0
                },
                'description': description[:500] if description else 'No description available',
                'images': images if images else [{'url': 'https://via.placeholder.com/400x300?text=No+Image', 'alt': 'No Image', 'is_primary': True}],
                'reviews': {'average_rating': 0, 'total_reviews': 0, 'recent_reviews': []},
                'availability': {
                    'in_stock': True,
                    'stock_quantity': 999,
                    'shipping_info': {'free_shipping': False, 'estimated_delivery': 'N/A', 'shipping_cost': 'N/A'}
                },
                'source': {
                    'url': url,
                    'platform': 'Generic',
                    'scraped_at': time.strftime('%Y-%m-%dT%H:%M:%S.000Z', time.gmtime())
                }
            }
            
        except Exception as e:
            # print(f"Error scraping generic URL: {str(e)}")
            return self._create_fallback_data(url, 'Generic', str(e))
    
    def _create_fallback_data(self, url, platform, error_msg):
        """Create fallback data when scraping fails"""
        return {
            'id': f"{platform.lower()}_{int(time.time())}",
            'title': f'{platform} Product',
            'brand': platform,
            'price': {'current': 0, 'original': 0, 'currency': 'USD', 'discount_percentage': 0},
            'description': f'Product from {platform}. Scraping error: {error_msg}',
            'images': [{'url': 'https://via.placeholder.com/400x300?text=No+Image', 'alt': 'No Image', 'is_primary': True}],
            'reviews': {'average_rating': 0, 'total_reviews': 0, 'recent_reviews': []},
            'availability': {
                'in_stock': True,
                'stock_quantity': 999,
                'shipping_info': {'free_shipping': False, 'estimated_delivery': 'N/A', 'shipping_cost': 'N/A'}
            },
            'source': {
                'url': url,
                'platform': platform,
                'scraped_at': time.strftime('%Y-%m-%dT%H:%M:%S.000Z', time.gmtime()),
                'error': error_msg
            }
        }

def main():
    """Test the scraper"""
    scraper = ProductScraper()
    
    # Test URLs
    test_urls = [
        'https://www.aliexpress.us/item/3256809100815258.html',
        'https://example.com',
        'https://httpbin.org/html'
    ]
    
    for url in test_urls:
        print(f"\n{'='*50}")
        print(f"Testing: {url}")
        print('='*50)
        
        result = scraper.scrape_product(url)
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
