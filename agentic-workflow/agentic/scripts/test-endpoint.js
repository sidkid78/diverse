// Simple test to check if the generate endpoint exists
const http = require('http');

console.log('Testing API endpoints...\n');

// Test 1: Health check
console.log('1. Testing /api/health');
http.get('http://localhost:3000/api/health', (res) => {
  console.log(`   Status: ${res.statusCode} ✓\n`);
  
  // Test 2: Plans list
  console.log('2. Testing /api/plans');
  http.get('http://localhost:3000/api/plans', (res2) => {
    console.log(`   Status: ${res2.statusCode} ✓\n`);
    
    // Test 3: Plans generate
    console.log('3. Testing /api/plans/generate (POST)');
    const data = JSON.stringify({
      mission_statement: 'Test mission',
      repo_url: 'https://github.com/sidkid78/test1'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/plans/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res3) => {
      console.log(`   Status: ${res3.statusCode}`);
      
      let body = '';
      res3.on('data', (chunk) => { body += chunk; });
      res3.on('end', () => {
        if (res3.statusCode === 200) {
          console.log('   ✓ Endpoint working!\n');
          const json = JSON.parse(body);
          console.log(`   Plan steps: ${json.plan?.length || 0}`);
          console.log(`   Context files: ${json.context_files?.length || 0}`);
        } else {
          console.log(`   ✗ Error: ${body}\n`);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`   ✗ Request failed: ${error.message}\n`);
    });

    req.write(data);
    req.end();
  }).on('error', (err) => console.error(`   Error: ${err.message}\n`));
}).on('error', (err) => console.error(`   Error: ${err.message}\n`));

