const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testScraping() {
  console.log('🧪 Testing Product Scraping Backend\n');
  
  // Test health endpoint
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }
  
  // Test generic scraping
  try {
    console.log('\n2. Testing generic scraping...');
    const genericResponse = await axios.get(`${BASE_URL}/scrape?url=https://example.com`);
    console.log('✅ Generic scraping successful');
    console.log('📦 Product title:', genericResponse.data.data.title);
    console.log('💰 Price:', genericResponse.data.data.price.current);
  } catch (error) {
    console.log('❌ Generic scraping failed:', error.response?.data?.error || error.message);
  }
  
  // Test AliExpress scraping (with a real product URL)
  try {
    console.log('\n3. Testing AliExpress scraping...');
    const aliResponse = await axios.get(`${BASE_URL}/scrape?url=https://www.aliexpress.com/item/1005001234567890.html`);
    console.log('✅ AliExpress scraping successful');
    console.log('📦 Product title:', aliResponse.data.data.title);
    console.log('💰 Price:', aliResponse.data.data.price.current);
    console.log('🖼️ Images found:', aliResponse.data.data.images.length);
  } catch (error) {
    console.log('❌ AliExpress scraping failed:', error.response?.data?.error || error.message);
  }
  
  // Test error handling
  try {
    console.log('\n4. Testing error handling...');
    const errorResponse = await axios.get(`${BASE_URL}/scrape`);
    console.log('❌ Should have failed but got:', errorResponse.data);
  } catch (error) {
    console.log('✅ Error handling works:', error.response?.data?.error);
  }
  
  console.log('\n🎉 Testing completed!');
}

// Run the test
testScraping().catch(console.error);
