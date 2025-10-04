const axios = require('axios');
const { scrapeWithPython, checkPythonAvailability } = require('./scrapers/pythonScraperWrapper');

const BASE_URL = 'http://localhost:3001';

async function testPythonIntegration() {
  console.log('🐍 Testing Python Scraper Integration\n');

  // 1. Test Python availability
  console.log('1. Testing Python availability...');
  try {
    const available = await checkPythonAvailability();
    console.log('✅ Python available:', available);
  } catch (error) {
    console.log('❌ Python check failed:', error.message);
  }

  // 2. Test direct Python scraper
  console.log('\n2. Testing direct Python scraper...');
  try {
    const result = await scrapeWithPython('https://example.com');
    console.log('✅ Direct Python scraper works');
    console.log('   Title:', result.title);
    console.log('   Images:', result.images.length);
  } catch (error) {
    console.log('❌ Direct Python scraper failed:', error.message);
  }

  // 3. Test backend with Python integration
  console.log('\n3. Testing backend with Python integration...');
  const testUrls = [
    'https://example.com',
    'https://httpbin.org/html',
    'https://www.aliexpress.us/item/3256809100815258.html'
  ];

  for (const url of testUrls) {
    try {
      console.log(`\n   Testing: ${url}`);
      const response = await axios.get(`${BASE_URL}/scrape?url=${encodeURIComponent(url)}`);
      
      if (response.data.success) {
        console.log('   ✅ Success');
        console.log(`   Title: ${response.data.data.title}`);
        console.log(`   Platform: ${response.data.data.source.platform}`);
        console.log(`   Images: ${response.data.data.images.length}`);
        console.log(`   Price: $${response.data.data.price.current}`);
      } else {
        console.log('   ❌ Failed:', response.data.error);
      }
    } catch (error) {
      console.log('   ❌ Error:', error.response?.data?.error || error.message);
    }
  }

  // 4. Test frontend integration
  console.log('\n4. Testing frontend integration...');
  try {
    const frontendResponse = await axios.get('http://localhost:5173/');
    if (frontendResponse.status === 200) {
      console.log('✅ Frontend is accessible');
      console.log('   You can now test the full integration:');
      console.log('   1. Open http://localhost:5173/');
      console.log('   2. Enter a product URL');
      console.log('   3. Click "Analyze Product"');
      console.log('   4. View the scraped data and AI-generated sales copy');
    } else {
      console.log('❌ Frontend not accessible');
    }
  } catch (error) {
    console.log('❌ Frontend check failed:', error.message);
    console.log('   Make sure frontend is running: npm run dev');
  }

  console.log('\n🎉 Python integration test completed!');
}

testPythonIntegration();

