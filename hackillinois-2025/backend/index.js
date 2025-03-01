require('dotenv').config();
const express = require('express');
const cors = require('cors');
const propertyRoutes = require('./src/routes/propertyRoutes');
const smartLockRoutes = require('./src/routes/smartLockRoutes');
const { formatResponse } = require('./src/utils/helpers');

// Import services
const blockchainService = require('./src/services/blockchainService');
const aiMonitoringService = require('./src/services/aiMonitoringService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',

  current_tenant: "8xF3...j9Kl",
  
  // With:
  is_rented: true,
  
  // And in the display logic, replace any references to current_tenant
  // with a simple "Rented" textost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize blockchain service
const initBlockchainService = async () => {
  try {
    await blockchainService.initialize();
    console.log('Blockchain service initialized successfully');
    
    // Start AI monitoring if enabled
    if (process.env.AI_MONITORING_ENABLED === 'true') {
      const interval = parseInt(process.env.AI_MONITORING_INTERVAL || '60000');
      aiMonitoringService.startMonitoring(interval);
      console.log(`AI monitoring started with ${interval}ms interval`);
    }
  } catch (error) {
    console.error('Failed to initialize blockchain service:', error);
  }
};

// Routes
app.get('/', (req, res) => {
  res.json(formatResponse(true, { 
    message: 'HackIllinois 2025 Rental System API is running!',
    version: '1.0.0',
    documentation: '/api/docs'
  }));
});

// API documentation
app.get('/api/docs', (req, res) => {
  res.json(formatResponse(true, {
    apiVersion: '1.0.0',
    endpoints: {
      properties: {
        GET: '/api/properties - List all properties',
        POST: '/api/properties - Create a new property',
        'GET /:id': '/api/properties/:id - Get a specific property',
        'POST /:id/book': '/api/properties/:id/book - Book a property',
        'POST /:id/access': '/api/properties/:id/access - Generate access key',
        'POST /:id/complete': '/api/properties/:id/complete - Complete rental'
      },
      smartLocks: {
        GET: '/api/locks - List all smart locks',
        POST: '/api/locks - Register a new smart lock',
        'GET /:id': '/api/locks/:id - Get a specific smart lock',
        'POST /:id/access': '/api/locks/:id/access - Grant access',
        'POST /:id/validate': '/api/locks/:id/validate - Validate access',
        'POST /:id/unlock': '/api/locks/:id/unlock - Unlock a door',
        'POST /:id/lock': '/api/locks/:id/lock - Lock a door',
        'POST /:id/revoke': '/api/locks/:id/revoke - Revoke access',
        'GET /:id/history': '/api/locks/:id/history - Get access history',
        'GET /:id/analyze': '/api/locks/:id/analyze - Analyze access patterns',
        'POST /monitoring/start': '/api/locks/monitoring/start - Start AI monitoring',
        'POST /monitoring/stop': '/api/locks/monitoring/stop - Stop AI monitoring',
        'POST /check-unauthorized': '/api/locks/check-unauthorized - Manually check for unauthorized access'
      }
    }
  }));
});

// API Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/locks', smartLockRoutes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json(formatResponse(false, null, 'Not Found'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(formatResponse(false, null, 'Server Error'));
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  
  // Initialize blockchain service
  await initBlockchainService();
});