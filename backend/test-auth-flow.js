const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testAuth() {
  const baseUrl = 'http://localhost:8082';
  const random = Math.floor(Math.random() * 10000);
  const email = `test${random}@example.com`;
  const password = 'password123';
  const firstName = 'Test';
  const lastName = 'User';

  console.log('Testing patient registration...');
  const regResult = await request({
    hostname: 'localhost',
    port: 8082,
    path: '/api/auth/register/patient',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }, {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
    phone: '1234567890',
    consent_to_terms: true,
    consent_to_privacy: true,
    hipaa_consent: true,
  });
  console.log('Registration response:', JSON.stringify(regResult, null, 2));
  if (regResult.statusCode !== 201) {
    throw new Error(`Registration failed: ${regResult.body.message}`);
  }
  console.log('Registration successful');

  console.log('Testing login...');
  const loginResult = await request({
    hostname: 'localhost',
    port: 8082,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }, {
    email,
    password,
  });
  console.log('Login response:', JSON.stringify(loginResult, null, 2));
  if (loginResult.statusCode !== 200) {
    throw new Error(`Login failed: ${loginResult.body.message}`);
  }
  const token = loginResult.body.data.token;
  console.log('Login successful, token received');

  console.log('Testing /api/auth/me...');
  const meResult = await request({
    hostname: 'localhost',
    port: 8082,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  console.log('Me response:', JSON.stringify(meResult, null, 2));
  if (meResult.statusCode !== 200) {
    throw new Error(`Me endpoint failed: ${meResult.body.message}`);
  }
  console.log('Me endpoint successful');

  console.log('All auth tests passed');
}

testAuth().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});