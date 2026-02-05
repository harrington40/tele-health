#!/usr/bin/env node

/**
 * Script to create a tech support user account
 * Usage: node create-tech-support.js
 */

const fetch = require('node-fetch');

async function createTechSupportUser() {
  const techSupportData = {
    email: 'support@transtechologies.com',
    password: 'TechSupport2026!',
    first_name: 'Tech',
    last_name: 'Support',
    phone: '+1234567890',
    employee_id: 'TS001',
    department: 'Technical Support'
  };

  console.log('Creating tech support account...');
  console.log('Email:', techSupportData.email);
  console.log('Employee ID:', techSupportData.employee_id);

  try {
    const apiUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/auth/register/tech-support`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(techSupportData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('\n✅ Tech support account created successfully!');
      console.log('\n📋 Login Credentials:');
      console.log('   Email:', techSupportData.email);
      console.log('   Password:', techSupportData.password);
      console.log('   Employee ID:', techSupportData.employee_id);
      console.log('\n🔗 Login URL: http://tel.transtechologies.com/tech-support-login');
      console.log('\nAccount details:', data);
    } else {
      console.error('\n❌ Failed to create tech support account');
      console.error('Error:', data.error || data.message);
      
      if (response.status === 409) {
        console.log('\nℹ️  Account already exists. Use these credentials:');
        console.log('   Email:', techSupportData.email);
        console.log('   Password:', techSupportData.password);
      }
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

createTechSupportUser();
