/**
 * Authentication middleware for protected routes
 * 
 * Note: This is a simple placeholder implementation.
 * For production, use a proper authentication system like JWT.
 */

// This is a placeholder for demo purposes only
// In a real app, use environment variables and a secure method
const API_KEY = 'hackillinois2025';

/**
 * Middleware to check if the request has a valid API key
 */
const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing API key',
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

/**
 * Middleware for routes that will require authentication in the future
 * Currently returns a warning that authentication will be required
 */
const authTodo = (req, res, next) => {
  console.warn('Warning: This route requires proper authentication in production');
  next();
};

module.exports = {
  requireApiKey,
  authTodo
};