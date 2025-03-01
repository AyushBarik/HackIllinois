/**
 * Smart Lock Routes
 * Handles API endpoints for smart lock management
 */

const express = require('express');
const router = express.Router();
const smartLockService = require('../services/smartLockService');
const aiMonitoringService = require('../services/aiMonitoringService');
const { formatResponse } = require('../utils/helpers');

// Get all smart locks
router.get('/', async (req, res) => {
  try {
    const locks = await smartLockService.getAllLocks();
    res.json(formatResponse(true, { locks }));
  } catch (error) {
    console.error('Error fetching smart locks:', error);
    res.status(500).json(formatResponse(false, null, 'Failed to fetch smart locks'));
  }
});

// Get a specific smart lock
router.get('/:id', async (req, res) => {
  try {
    const lockId = req.params.id;
    const lock = await smartLockService.getLock(lockId);
    res.json(formatResponse(true, { lock }));
  } catch (error) {
    console.error('Error fetching smart lock:', error);
    res.status(404).json(formatResponse(false, null, error.message || 'Smart lock not found'));
  }
});

// Register a new smart lock
router.post('/', async (req, res) => {
  try {
    const { id, name } = req.body;
    
    if (!id || !name) {
      return res.status(400).json(formatResponse(false, null, 'Lock ID and name are required'));
    }
    
    const newLock = await smartLockService.registerLock({ id, name });
    res.status(201).json(formatResponse(true, { lock: newLock }));
  } catch (error) {
    console.error('Error registering smart lock:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to register smart lock'));
  }
});

// Grant access to a smart lock
router.post('/:id/access', async (req, res) => {
  try {
    const lockId = req.params.id;
    const { accessToken, tenantPublicKey, validUntil } = req.body;
    
    if (!accessToken || !tenantPublicKey || !validUntil) {
      return res.status(400).json(formatResponse(false, null, 'Missing required fields'));
    }
    
    const result = await smartLockService.grantAccess(lockId, accessToken, tenantPublicKey, validUntil);
    res.json(formatResponse(true, result));
  } catch (error) {
    console.error('Error granting access:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to grant access'));
  }
});

// Validate access to a smart lock
router.post('/:id/validate', async (req, res) => {
  try {
    const lockId = req.params.id;
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json(formatResponse(false, null, 'Access token is required'));
    }
    
    const result = await smartLockService.validateAccess(lockId, accessToken);
    
    if (!result.isValid) {
      return res.status(403).json(formatResponse(false, null, `Access denied: ${result.reason}`));
    }
    
    res.json(formatResponse(true, result));
  } catch (error) {
    console.error('Error validating access:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to validate access'));
  }
});

// Unlock a smart lock
router.post('/:id/unlock', async (req, res) => {
  try {
    const lockId = req.params.id;
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json(formatResponse(false, null, 'Access token is required'));
    }
    
    const result = await smartLockService.unlockDoor(lockId, accessToken);
    res.json(formatResponse(true, result));
  } catch (error) {
    console.error('Error unlocking door:', error);
    res.status(403).json(formatResponse(false, null, error.message || 'Failed to unlock door'));
  }
});

// Lock a smart lock
router.post('/:id/lock', async (req, res) => {
  try {
    const lockId = req.params.id;
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json(formatResponse(false, null, 'Access token is required'));
    }
    
    const result = await smartLockService.lockDoor(lockId, accessToken);
    res.json(formatResponse(true, result));
  } catch (error) {
    console.error('Error locking door:', error);
    res.status(403).json(formatResponse(false, null, error.message || 'Failed to lock door'));
  }
});

// Revoke access to a smart lock
router.post('/:id/revoke', async (req, res) => {
  try {
    const lockId = req.params.id;
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json(formatResponse(false, null, 'Access token is required'));
    }
    
    const result = await smartLockService.revokeAccess(lockId, accessToken);
    res.json(formatResponse(true, result));
  } catch (error) {
    console.error('Error revoking access:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to revoke access'));
  }
});

// Get access history for a smart lock
router.get('/:id/history', async (req, res) => {
  try {
    const lockId = req.params.id;
    const history = await smartLockService.getAccessHistory(lockId);
    res.json(formatResponse(true, { history }));
  } catch (error) {
    console.error('Error fetching access history:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to fetch access history'));
  }
});

// Analyze access patterns for a smart lock
router.get('/:id/analyze', async (req, res) => {
  try {
    const lockId = req.params.id;
    const analysis = await aiMonitoringService.analyzeAccessPatterns(lockId);
    res.json(formatResponse(true, analysis));
  } catch (error) {
    console.error('Error analyzing access patterns:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to analyze access patterns'));
  }
});

// Manually check for unauthorized access (for testing and demos)
router.post('/check-unauthorized', async (req, res) => {
  try {
    const result = await aiMonitoringService.manualCheck();
    res.json(formatResponse(true, result));
  } catch (error) {
    console.error('Error checking for unauthorized access:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to check for unauthorized access'));
  }
});

// Start AI monitoring
router.post('/monitoring/start', async (req, res) => {
  try {
    const { interval } = req.body;
    const result = aiMonitoringService.startMonitoring(interval);
    res.json(formatResponse(true, result));
  } catch (error) {
    console.error('Error starting monitoring:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to start monitoring'));
  }
});

// Stop AI monitoring
router.post('/monitoring/stop', async (req, res) => {
  try {
    const result = aiMonitoringService.stopMonitoring();
    res.json(formatResponse(true, result));
  } catch (error) {
    console.error('Error stopping monitoring:', error);
    res.status(500).json(formatResponse(false, null, error.message || 'Failed to stop monitoring'));
  }
});

module.exports = router;