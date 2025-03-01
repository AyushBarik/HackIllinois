/**
 * HackIllinois 2025 Blockchain Rental System Demo
 * 
 * This script demonstrates the key features of the rental system by making API calls
 * to simulate a complete rental workflow.
 */

const axios = require('axios');
const API_URL = 'http://localhost:3001/api';

// Mock data for demo
const demoTenant = {
  publicKey: 'DEMO_TENANT_' + Date.now().toString(36),
  name: 'Demo Tenant'
};

const demoOwner = {
  publicKey: 'DEMO_OWNER_' + Date.now().toString(36),
  name: 'Demo Property Owner'
};

// Store data between steps
let propertyId = 1; // We'll use the beach house
let accessToken = null;
let smartLockId = 'LOCK123';

// Sleep function for adding pauses between steps
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Print colored text
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper to print the demo steps
function printStep(step, description) {
  console.log('\n');
  console.log(`${colors.bright}${colors.blue}======== STEP ${step}: ${description} ========${colors.reset}`);
}

// Helper to print API responses
function printResponse(title, data) {
  console.log(`${colors.yellow}${title}:${colors.reset}`);
  console.log(JSON.stringify(data, null, 2));
}

// Helper to make API calls
async function callAPI(method, endpoint, data = null) {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log(`${colors.dim}API ${method.toUpperCase()}: ${url}${colors.reset}`);
    
    let response;
    if (method.toLowerCase() === 'get') {
      response = await axios.get(url);
    } else if (method.toLowerCase() === 'post') {
      response = await axios.post(url, data);
    }
    
    return response.data;
  } catch (error) {
    console.error(`${colors.red}Error calling API:${colors.reset}`, error.response?.data || error.message);
    throw error;
  }
}

// Run the demo
async function runDemo() {
  console.log(`${colors.bright}${colors.green}
  =======================================================
  🏠 BLOCKCHAIN RENTAL SYSTEM DEMO - HACKILLINOIS 2025 🏠
  =======================================================
  ${colors.reset}`);
  
  console.log(`${colors.cyan}This demo will walk through the complete rental process:${colors.reset}`);
  console.log(`${colors.cyan}1. Viewing available properties${colors.reset}`);
  console.log(`${colors.cyan}2. Booking a property${colors.reset}`);
  console.log(`${colors.cyan}3. Generating digital access keys${colors.reset}`);
  console.log(`${colors.cyan}4. Accessing the smart lock${colors.reset}`);
  console.log(`${colors.cyan}5. Demonstrating unauthorized access detection${colors.reset}`);
  console.log(`${colors.cyan}6. Completing the rental${colors.reset}`);
  
  try {
    // Step 1: View available properties
    printStep(1, 'View Available Properties');
    const propertiesResponse = await callAPI('get', '/properties');
    printResponse('Available Properties', propertiesResponse.data.properties);
    await sleep(2000);
    
    // Step 2: View a specific property
    printStep(2, 'View Property Details');
    const propertyResponse = await callAPI('get', `/properties/${propertyId}`);
    printResponse('Property Details', propertyResponse.data.property);
    smartLockId = propertyResponse.data.property.smart_lock_id;
    await sleep(2000);
    
    // Step 3: Book the property
    printStep(3, 'Book the Property');
    const bookingResponse = await callAPI('post', `/properties/${propertyId}/book`, {
      tenant: demoTenant.publicKey,
      duration_days: 7
    });
    printResponse('Booking Confirmation', bookingResponse.data.booking);
    await sleep(2000);
    
    // Step 4: Generate digital access key
    printStep(4, 'Generate Digital Access Key');
    const accessResponse = await callAPI('post', `/properties/${propertyId}/access`, {
      tenant: demoTenant.publicKey
    });
    printResponse('Digital Access Key', accessResponse.data.access_key);
    accessToken = accessResponse.data.access_key.accessToken;
    await sleep(2000);
    
    // Step 5: Get smart lock details
    printStep(5, 'Get Smart Lock Details');
    const lockResponse = await callAPI('get', `/locks/${smartLockId}`);
    printResponse('Smart Lock Details', lockResponse.data.lock);
    await sleep(2000);
    
    // Step 6: Grant access to smart lock
    printStep(6, 'Grant Access to Smart Lock');
    const grantResponse = await callAPI('post', `/locks/${smartLockId}/access`, {
      accessToken: accessToken,
      tenantPublicKey: demoTenant.publicKey,
      validUntil: accessResponse.data.access_key.validUntil
    });
    printResponse('Access Grant Result', grantResponse.data);
    await sleep(2000);
    
    // Step 7: Unlock the door
    printStep(7, 'Unlock the Door');
    const unlockResponse = await callAPI('post', `/locks/${smartLockId}/unlock`, {
      accessToken: accessToken
    });
    printResponse('Unlock Result', unlockResponse.data);
    await sleep(2000);
    
    // Step 8: Lock the door
    printStep(8, 'Lock the Door');
    const lockDoorResponse = await callAPI('post', `/locks/${smartLockId}/lock`, {
      accessToken: accessToken
    });
    printResponse('Lock Result', lockDoorResponse.data);
    await sleep(2000);
    
    // Step 9: View access history
    printStep(9, 'View Access History');
    const historyResponse = await callAPI('get', `/locks/${smartLockId}/history`);
    printResponse('Access History', historyResponse.data.history);
    await sleep(2000);
    
    // Step 10: Check for unauthorized access
    printStep(10, 'Detect Unauthorized Access');
    console.log(`${colors.magenta}Simulating owner trying to access during active rental...${colors.reset}`);
    const checkResponse = await callAPI('post', `/locks/check-unauthorized`);
    printResponse('Unauthorized Access Detection', checkResponse.data);
    await sleep(2000);
    
    // Step 11: Analyze access patterns
    printStep(11, 'Analyze Access Patterns with AI');
    const analysisResponse = await callAPI('get', `/locks/${smartLockId}/analyze`);
    printResponse('AI Analysis', analysisResponse.data);
    await sleep(2000);
    
    // Step 12: Complete the rental
    printStep(12, 'Complete the Rental');
    const completeResponse = await callAPI('post', `/properties/${propertyId}/complete`);
    printResponse('Rental Completion', completeResponse.data);
    await sleep(2000);
    
    // Step 13: Revoke access
    printStep(13, 'Revoke Access');
    const revokeResponse = await callAPI('post', `/locks/${smartLockId}/revoke`, {
      accessToken: accessToken
    });
    printResponse('Access Revocation', revokeResponse.data);
    
    // Demo completed
    console.log(`\n${colors.bright}${colors.green}
    ========================================
    ✅ DEMO COMPLETED SUCCESSFULLY! ✅
    ========================================
    ${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}Demo failed:${colors.reset}`, error);
  }
}

// Check if this file is executed directly
if (require.main === module) {
  // Make sure the API server is running before starting the demo
  axios.get(`${API_URL}/docs`)
    .then(() => {
      console.log(`${colors.green}API server is running. Starting demo...${colors.reset}`);
      runDemo();
    })
    .catch(error => {
      console.error(`${colors.red}Error: API server is not running at ${API_URL}${colors.reset}`);
      console.error('Please start the API server with "npm run dev" and try again.');
      process.exit(1);
    });
}