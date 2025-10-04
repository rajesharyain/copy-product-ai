
const { chromium } = require('playwright');
const cheerio = require('cheerio');
const { scrapeWithPython, checkPythonAvailability } = require('./pythonScraperWrapper');

/**
 * Main product scraper function with Python fallback
 * @param {string} url - Product URL to scrape
 * @returns {Object} Scraped product data
 */
async function scrapeProduct(url) {
  const domain = new URL(url).hostname.toLowerCase();
  
  // Try Python scraper first if available
  const pythonAvailable = await checkPythonAvailability();
  if (pythonAvailable) {
    console.log('🐍 Using Python scraper for better data extraction');
    try {
      const result = await scrapeWithPython(url);
      if (result && !result.error) {
        return result;
      }
    } catch (error) {
      console.log('⚠️ Python scraper failed, falling back to Node.js:', error.message);
    }
  }
  
  // Fallback to Node.js scrapers
  console.log('🟨 Using Node.js scraper');
  if (domain.includes('aliexpress')) {
    return await scrapeAliExpress(url);
  } else if (domain.includes('amazon')) {
    return await scrapeAmazon(url);
  } else if (domain.includes('ebay')) {
    return await scrapeEbay(url);
  } else {
    // Generic scraper for other sites
    return await scrapeGeneric(url);
  }
}

/**
 * AliExpress product scraper
 * @param {string} url - AliExpress product URL
 * @returns {Object} Scraped product data
 */
async function scrapeAliExpress(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });
  const page = await context.newPage();
  
  try {
    // Navigate to the product page
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Extract product data using Playwright
    const productData = await page.evaluate(() => {
      const data = {};
      
      // Title - try multiple selectors
      const titleSelectors = [
        '[data-pl="product-title"]',
        '.product-title-text',
        'h1',
        '.product-title',
        '[data-testid="product-title"]',
        '.title-text',
        '.product-name'
      ];
      
      let titleElement = null;
      for (const selector of titleSelectors) {
        titleElement = document.querySelector(selector);
        if (titleElement && titleElement.textContent.trim()) {
          break;
        }
      }
      
      data.title = titleElement ? titleElement.textContent.trim() : 'AliExpress Product';
      
      // Price - try multiple selectors
      const priceSelectors = [
        '.notranslate',
        '[data-pl="product-price"]',
        '.price-current',
        '.price',
        '.product-price',
        '[data-testid="price"]',
        '.price-value'
      ];
      
      let priceElement = null;
      for (const selector of priceSelectors) {
        priceElement = document.querySelector(selector);
        if (priceElement && priceElement.textContent.trim()) {
          break;
        }
      }
      data.price = priceElement ? priceElement.textContent.trim() : '$0.00';
      
      // Images - try multiple selectors
      const imageSelectors = [
        '.images-view-item img',
        '.product-image img',
        '.gallery-image img',
        '.product-gallery img',
        'img[src*="alicdn"]',
        'img[alt*="product"]'
      ];
      
      let imageElements = [];
      for (const selector of imageSelectors) {
        imageElements = document.querySelectorAll(selector);
        if (imageElements.length > 0) break;
      }
      
      data.images = Array.from(imageElements).map(img => img.src || img.getAttribute('data-src')).filter(src => src && src.startsWith('http'));
      
      // Description - try multiple selectors
      const descSelectors = [
        '.product-description',
        '[data-pl="product-description"]',
        '.product-detail-description',
        '.description',
        '.product-details',
        '.product-info'
      ];
      
      let descElement = null;
      for (const selector of descSelectors) {
        descElement = document.querySelector(selector);
        if (descElement && descElement.textContent.trim()) {
          break;
        }
      }
      data.description = descElement ? descElement.textContent.trim() : 'Product description not available';
      
      // Reviews
      const reviewElements = document.querySelectorAll('.review-item, .feedback-item');
      data.reviews = Array.from(reviewElements).slice(0, 5).map(review => {
        const rating = review.querySelector('.star-view, .rating')?.textContent?.trim() || 'No rating';
        const text = review.querySelector('.review-content, .feedback-content')?.textContent?.trim() || 'No review text';
        const author = review.querySelector('.user-name, .buyer-name')?.textContent?.trim() || 'Anonymous';
        return { rating, text, author };
      });
      
      // Rating
      const ratingElement = document.querySelector('.overview-rating-average') ||
                           document.querySelector('.rating-average') ||
                           document.querySelector('[data-pl="rating-average"]');
      data.averageRating = ratingElement ? ratingElement.textContent.trim() : 'No rating';
      
      // Review count
      const reviewCountElement = document.querySelector('.overview-rating-total') ||
                                document.querySelector('.rating-total') ||
                                document.querySelector('[data-pl="rating-total"]');
      data.totalReviews = reviewCountElement ? reviewCountElement.textContent.trim() : '0';
      
      return data;
    });
    
    await browser.close();
    
    // Format the data to match our expected structure
    return {
      id: `aliexpress_${Date.now()}`,
      title: productData.title,
      brand: 'AliExpress Seller',
      price: {
        current: parsePrice(productData.price),
        original: parsePrice(productData.price),
        currency: 'USD',
        discount_percentage: 0
      },
      description: productData.description,
      short_description: productData.description.substring(0, 150) + '...',
      images: productData.images.map((url, index) => ({
        url: url,
        alt: `${productData.title} - Image ${index + 1}`,
        is_primary: index === 0
      })),
      variants: [
        {
          id: 'default',
          name: 'Default',
          color: '#000000',
          price: parsePrice(productData.price),
          in_stock: true,
          stock_quantity: 100
        }
      ],
      specifications: [],
      features: extractFeatures(productData.description),
      reviews: {
        average_rating: parseFloat(productData.averageRating) || 0,
        total_reviews: parseInt(productData.totalReviews.replace(/[^\d]/g, '')) || 0,
        rating_distribution: {
          "5": 0,
          "4": 0,
          "3": 0,
          "2": 0,
          "1": 0
        },
        recent_reviews: productData.reviews.map((review, index) => ({
          id: `review_${index}`,
          user_name: review.author,
          rating: parseFloat(review.rating) || 5,
          title: `Review ${index + 1}`,
          comment: review.text,
          date: new Date().toISOString().split('T')[0],
          verified_purchase: true
        }))
      },
      availability: {
        in_stock: true,
        stock_quantity: 100,
        shipping_info: {
          free_shipping: true,
          estimated_delivery: '7-15 business days',
          shipping_cost: 0
        }
      },
      category: 'Electronics',
      tags: ['aliexpress', 'online', 'shopping'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source: {
        url: url,
        platform: 'AliExpress',
        scraped_at: new Date().toISOString()
      }
    };
    
  } catch (error) {
    await browser.close();
    throw new Error(`Failed to scrape AliExpress product: ${error.message}`);
  }
}

/**
 * Amazon product scraper (placeholder)
 * @param {string} url - Amazon product URL
 * @returns {Object} Scraped product data
 */
async function scrapeAmazon(url) {
  // TODO: Implement Amazon scraping
  throw new Error('Amazon scraping not implemented yet');
}

/**
 * eBay product scraper (placeholder)
 * @param {string} url - eBay product URL
 * @returns {Object} Scraped product data
 */
async function scrapeEbay(url) {
  // TODO: Implement eBay scraping
  throw new Error('eBay scraping not implemented yet');
}

/**
 * Generic product scraper using Cheerio
 * @param {string} url - Product URL
 * @returns {Object} Scraped product data
 */
async function scrapeGeneric(url) {
  const axios = require('axios');
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Generic selectors for common product page elements
    const title = $('h1').first().text().trim() || 
                 $('[data-testid="product-title"]').text().trim() ||
                 $('.product-title').text().trim() ||
                 'Product Title';
    
    const price = $('[data-testid="price"]').text().trim() ||
                 $('.price').text().trim() ||
                 $('.product-price').text().trim() ||
                 'Price not found';
    
    const description = $('[data-testid="product-description"]').text().trim() ||
                       $('.product-description').text().trim() ||
                       $('.description').text().trim() ||
                       'Description not found';
    
    const images = [];
    $('img').each((i, img) => {
      const src = $(img).attr('src') || $(img).attr('data-src');
      if (src && src.startsWith('http')) {
        images.push(src);
      }
    });
    
    return {
      id: `generic_${Date.now()}`,
      title: title,
      brand: 'Unknown Brand',
      price: {
        current: parsePrice(price),
        original: parsePrice(price),
        currency: 'USD',
        discount_percentage: 0
      },
      description: description,
      short_description: description.substring(0, 150) + '...',
      images: images.slice(0, 5).map((url, index) => ({
        url: url,
        alt: `${title} - Image ${index + 1}`,
        is_primary: index === 0
      })),
      variants: [
        {
          id: 'default',
          name: 'Default',
          color: '#000000',
          price: parsePrice(price),
          in_stock: true,
          stock_quantity: 100
        }
      ],
      specifications: [],
      features: extractFeatures(description),
      reviews: {
        average_rating: 4.0,
        total_reviews: 0,
        rating_distribution: {
          "5": 0,
          "4": 0,
          "3": 0,
          "2": 0,
          "1": 0
        },
        recent_reviews: []
      },
      availability: {
        in_stock: true,
        stock_quantity: 100,
        shipping_info: {
          free_shipping: false,
          estimated_delivery: '5-7 business days',
          shipping_cost: 9.99
        }
      },
      category: 'General',
      tags: ['generic', 'online', 'shopping'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source: {
        url: url,
        platform: 'Generic',
        scraped_at: new Date().toISOString()
      }
    };
    
  } catch (error) {
    throw new Error(`Failed to scrape generic product: ${error.message}`);
  }
}

/**
 * Parse price string and extract numeric value
 * @param {string} priceStr - Price string
 * @returns {number} Parsed price
 */
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  
  // Remove currency symbols and extract number
  const match = priceStr.match(/[\d,]+\.?\d*/);
  if (match) {
    return parseFloat(match[0].replace(/,/g, ''));
  }
  
  return 0;
}

/**
 * Extract features from description text
 * @param {string} description - Product description
 * @returns {Array} Array of features
 */
function extractFeatures(description) {
  if (!description) return [];
  
  // Simple feature extraction - look for bullet points or numbered lists
  const features = [];
  const lines = description.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.match(/^[•\-\*]\s/) || trimmed.match(/^\d+\.\s/)) {
      features.push(trimmed.replace(/^[•\-\*\d\.]\s/, ''));
    }
  });
  
  // If no bullet points found, extract sentences that might be features
  if (features.length === 0) {
    const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 10);
    features.push(...sentences.slice(0, 5).map(s => s.trim()));
  }
  
  return features.slice(0, 7); // Limit to 7 features
}

module.exports = {
  scrapeProduct,
  scrapeAliExpress,
  scrapeAmazon,
  scrapeEbay,
  scrapeGeneric
};
