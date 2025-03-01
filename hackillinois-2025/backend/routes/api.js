const express = require('express');
const router = express.Router();
const { requireApiKey, authTodo } = require('../middleware/auth');
const { formatResponse } = require('../utils/helpers');
const eventController = require('../controllers/eventController');

// GET /api/info - Get API information
router.get('/info', (req, res) => {
  res.json(formatResponse(true, {
    name: 'HackIllinois 2025 API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  }));
});

// Event routes
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);
router.post('/events', authTodo, eventController.createEvent);

// Protected route example
router.get('/protected', requireApiKey, (req, res) => {
  res.json(formatResponse(true, {
    message: 'This is a protected endpoint',
    data: 'You have successfully authenticated with the API key'
  }));
});

// Sample error route
router.get('/error', (req, res) => {
  res.status(500).json(formatResponse(false, null, 'This is a sample error response'));
});

module.exports = router;