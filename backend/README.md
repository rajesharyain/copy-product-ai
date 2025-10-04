# Product Scraping Backend

Express.js backend service for scraping product data from various e-commerce websites.

## Features

- **Multi-platform scraping**: AliExpress, Amazon, eBay, and generic sites
- **Playwright integration**: For dynamic content scraping
- **Cheerio support**: For static HTML parsing
- **CORS enabled**: For frontend integration
- **Error handling**: Comprehensive error management

## Installation

```bash
npm install
npx playwright install
```

## Usage

### Start the server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### API Endpoints

#### Health Check
```
GET /health
```

#### Scrape Product
```
GET /scrape?url=<product-url>
```

**Example:**
```bash
curl "http://localhost:3001/scrape?url=https://www.aliexpress.com/item/1234567890.html"
```

## Supported Platforms

- ✅ **AliExpress**: Full product data extraction
- 🚧 **Amazon**: Placeholder (not implemented)
- 🚧 **eBay**: Placeholder (not implemented)
- ✅ **Generic sites**: Basic scraping with common selectors

## Response Format

```json
{
  "success": true,
  "data": {
    "id": "aliexpress_1234567890",
    "title": "Product Title",
    "brand": "Brand Name",
    "price": {
      "current": 29.99,
      "original": 39.99,
      "currency": "USD",
      "discount_percentage": 25
    },
    "description": "Product description...",
    "images": [
      {
        "url": "https://example.com/image1.jpg",
        "alt": "Product Image 1",
        "is_primary": true
      }
    ],
    "reviews": {
      "average_rating": 4.5,
      "total_reviews": 150,
      "recent_reviews": [...]
    },
    "availability": {
      "in_stock": true,
      "stock_quantity": 50
    },
    "source": {
      "url": "https://example.com/product",
      "platform": "AliExpress",
      "scraped_at": "2024-01-01T00:00:00.000Z"
    }
  },
  "scrapedAt": "2024-01-01T00:00:00.000Z"
}
```

## Environment Variables

- `PORT`: Server port (default: 3001)

## Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Development

### Adding New Scrapers

1. Create a new scraper function in `scrapers/productScraper.js`
2. Add domain detection logic in `scrapeProduct()`
3. Follow the standard data format

### Testing

Test the scraping endpoint with various product URLs:

```bash
# AliExpress product
curl "http://localhost:3001/scrape?url=https://www.aliexpress.com/item/1005001234567890.html"

# Generic site
curl "http://localhost:3001/scrape?url=https://example-store.com/product/123"
```

## Notes

- AliExpress scraping uses Playwright for dynamic content
- Generic scraping uses Cheerio for static HTML
- All scrapers include error handling and fallbacks
- User agents are set to avoid detection
- Timeouts are configured for reliability
