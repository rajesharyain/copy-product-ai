# Frontend-Backend Integration Guide

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:3001`

### 2. Start the Frontend Development Server
```bash
npm run dev
```
The frontend will run on `http://localhost:5173`

### 3. Test the Integration
Open `test-integration.html` in your browser to run automated tests.

## 🔄 How It Works

### Data Flow
1. **User Input**: User enters a product URL in the frontend
2. **API Call**: Frontend calls `http://localhost:3001/scrape?url=<product-url>`
3. **Scraping**: Backend scrapes the product data using Playwright/Cheerio
4. **Data Processing**: Frontend processes the scraped data
5. **Sales Copy Generation**: AI-enhanced sales copy is generated
6. **Rendering**: Product page is rendered with real data

### API Endpoints

#### Backend (`http://localhost:3001`)
- `GET /health` - Health check
- `GET /scrape?url=<product-url>` - Scrape product data

#### Frontend (`http://localhost:5173`)
- `/` - URL Analyzer page
- Product data display with sales copy
- Product Page with funnel layout

## 🧪 Testing

### Manual Testing
1. Open `http://localhost:5173/`
2. Enter a product URL (try `https://example.com` for testing)
3. Click "Analyze Product"
4. View the scraped data and generated sales copy
5. Click "Product Page" to see the funnel layout

### Automated Testing
Open `test-integration.html` in your browser for automated tests.

## 📊 Supported Platforms

- ✅ **Generic Sites**: Basic scraping with Cheerio
- ✅ **AliExpress**: Advanced scraping with Playwright
- 🚧 **Amazon**: Placeholder (ready for implementation)
- 🚧 **eBay**: Placeholder (ready for implementation)

## 🔧 Configuration

### Backend Configuration
- **Port**: 3001 (configurable via `PORT` environment variable)
- **CORS**: Enabled for frontend integration
- **Timeout**: 30 seconds for scraping operations

### Frontend Configuration
- **Backend URL**: `http://localhost:3001` (hardcoded in `productService.js`)
- **Fallback**: Uses mock data if backend is unavailable

## 🐛 Troubleshooting

### Common Issues

1. **Backend not responding**
   - Check if backend server is running: `http://localhost:3001/health`
   - Verify port 3001 is not blocked

2. **CORS errors**
   - Backend has CORS enabled, but check browser console for errors
   - Ensure frontend is calling the correct backend URL

3. **Scraping timeouts**
   - Some sites have anti-bot measures
   - Try with different URLs or check backend logs

4. **Frontend not loading**
   - Check if frontend dev server is running: `http://localhost:5173/`
   - Verify no port conflicts

### Debug Mode
- Backend logs all scraping operations
- Frontend logs API calls and data processing
- Check browser console for detailed error messages

## 📝 Example Usage

### Scraping a Product
```javascript
// Frontend code (productService.js)
const result = await fetchProductData('https://example.com/product');
if (result.success) {
  const salesCopy = generateSalesCopy(result.data);
  // Render product page with real data
}
```

### Backend Response Format
```json
{
  "success": true,
  "data": {
    "id": "generic_1234567890",
    "title": "Product Title",
    "price": {
      "current": 29.99,
      "currency": "USD"
    },
    "images": [...],
    "reviews": {...},
    "source": {
      "url": "https://example.com/product",
      "platform": "Generic",
      "scraped_at": "2024-01-01T00:00:00.000Z"
    }
  },
  "scrapedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 Next Steps

1. **Add more platforms**: Implement Amazon and eBay scrapers
2. **Enhance error handling**: Better fallbacks and user feedback
3. **Add authentication**: Secure the scraping endpoints
4. **Performance optimization**: Caching and rate limiting
5. **Deploy**: Set up production deployment for both frontend and backend
