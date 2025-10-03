const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testServer() {
  try {
    console.log('Testing server connection...');
    
    // Test basic connection
    const response = await axios.get(`${BASE_URL}/properties`);
    console.log('✓ Server is running and responding');
    console.log(`✓ Properties endpoint returned ${response.data.properties?.length || 0} properties`);
    
    return true;
  } catch (error) {
    console.error('✗ Server test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('✗ Server is not running on port 5000');
    }
    return false;
  }
}

// Run test
testServer().then(success => {
  process.exit(success ? 0 : 1);
});