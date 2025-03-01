/**
 * Common utility functions for the HackIllinois API
 */

/**
 * Format a response object with consistent structure
 * 
 * @param {boolean} success - Whether the operation was successful
 * @param {object|null} data - The data to return (if successful)
 * @param {string|null} error - Error message (if unsuccessful)
 * @returns {object} Formatted response object
 */
const formatResponse = (success = true, data = null, error = null) => {
  return {
    success,
    data,
    error,
    timestamp: new Date().toISOString()
  };
};

/**
 * Validate that required fields are present in the request
 * 
 * @param {object} body - The request body
 * @param {string[]} requiredFields - Array of required field names
 * @returns {object} Object with isValid and missing fields
 */
const validateFields = (body, requiredFields) => {
  const missingFields = requiredFields.filter(field => !body[field]);
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

module.exports = {
  formatResponse,
  validateFields
};