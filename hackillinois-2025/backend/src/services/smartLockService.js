/**
 * Smart Lock Service
 * Handles interaction with IoT-based smart locks
 */

// This is a simulated service for the hackathon
// In a real implementation, this would interact with real IoT devices

class SmartLockService {
  constructor() {
    // Mock database of smart locks for simulation
    this.locks = new Map();
    this.accessHistory = [];
    
    // Add some sample locks for testing
    this.locks.set('LOCK123', {
      id: 'LOCK123',
      name: 'Beach House Front Door',
      status: 'locked',
      battery: 92,
      lastConnected: new Date().toISOString(),
      currentAccess: null,
    });
    
    this.locks.set('LOCK456', {
      id: 'LOCK456',
      name: 'Mountain Cabin Main Entrance',
      status: 'locked',
      battery: 78,
      lastConnected: new Date().toISOString(),
      currentAccess: null,
    });
  }

  /**
   * Get all registered smart locks
   */
  async getAllLocks() {
    return Array.from(this.locks.values());
  }

  /**
   * Get a specific smart lock by ID
   */
  async getLock(lockId) {
    const lock = this.locks.get(lockId);
    if (!lock) {
      throw new Error(`Smart lock with ID ${lockId} not found`);
    }
    return lock;
  }

  /**
   * Register a new smart lock
   */
  async registerLock(lockData) {
    const { id, name } = lockData;
    
    if (!id || !name) {
      throw new Error('Lock ID and name are required');
    }
    
    if (this.locks.has(id)) {
      throw new Error(`Smart lock with ID ${id} already exists`);
    }
    
    const newLock = {
      id,
      name,
      status: 'locked',
      battery: 100,
      lastConnected: new Date().toISOString(),
      currentAccess: null,
    };
    
    this.locks.set(id, newLock);
    return newLock;
  }

  /**
   * Grant access to a smart lock
   */
  async grantAccess(lockId, accessToken, tenantPublicKey, validUntil) {
    const lock = await this.getLock(lockId);
    
    // Update lock with access information
    lock.currentAccess = {
      accessToken,
      tenantPublicKey,
      grantedAt: new Date().toISOString(),
      validUntil,
    };
    
    this.locks.set(lockId, lock);
    
    // Record access grant in history
    this.accessHistory.push({
      lockId,
      type: 'access_granted',
      accessToken,
      tenantPublicKey,
      timestamp: new Date().toISOString(),
    });
    
    return {
      success: true,
      message: `Access granted to lock ${lockId} for tenant ${tenantPublicKey}`,
      validUntil,
    };
  }

  /**
   * Revoke access to a smart lock
   */
  async revokeAccess(lockId, accessToken) {
    const lock = await this.getLock(lockId);
    
    // Check if the access token matches
    if (!lock.currentAccess || lock.currentAccess.accessToken !== accessToken) {
      throw new Error('Invalid access token');
    }
    
    // Revoke access
    lock.currentAccess = null;
    lock.status = 'locked';
    
    this.locks.set(lockId, lock);
    
    // Record access revocation in history
    this.accessHistory.push({
      lockId,
      type: 'access_revoked',
      accessToken,
      timestamp: new Date().toISOString(),
    });
    
    return {
      success: true,
      message: `Access revoked for lock ${lockId}`,
    };
  }

  /**
   * Validate access to a smart lock
   */
  async validateAccess(lockId, accessToken) {
    const lock = await this.getLock(lockId);
    
    // Check if lock has an active access grant
    if (!lock.currentAccess) {
      return { isValid: false, reason: 'No active access' };
    }
    
    // Check if access token matches
    if (lock.currentAccess.accessToken !== accessToken) {
      return { isValid: false, reason: 'Invalid access token' };
    }
    
    // Check if access is still valid (not expired)
    const now = new Date();
    const validUntil = new Date(lock.currentAccess.validUntil);
    
    if (now > validUntil) {
      return { isValid: false, reason: 'Access token expired' };
    }
    
    // Record access validation in history
    this.accessHistory.push({
      lockId,
      type: 'access_validated',
      accessToken,
      timestamp: new Date().toISOString(),
    });
    
    return {
      isValid: true,
      grantedTo: lock.currentAccess.tenantPublicKey,
      validUntil: lock.currentAccess.validUntil,
    };
  }

  /**
   * Unlock a smart lock
   */
  async unlockDoor(lockId, accessToken) {
    // Validate access first
    const validationResult = await this.validateAccess(lockId, accessToken);
    
    if (!validationResult.isValid) {
      throw new Error(`Access denied: ${validationResult.reason}`);
    }
    
    const lock = await this.getLock(lockId);
    
    // Unlock the door
    lock.status = 'unlocked';
    this.locks.set(lockId, lock);
    
    // Record unlock event in history
    this.accessHistory.push({
      lockId,
      type: 'door_unlocked',
      accessToken,
      timestamp: new Date().toISOString(),
    });
    
    return {
      success: true,
      lockId,
      status: lock.status,
      message: 'Door unlocked successfully',
    };
  }

  /**
   * Lock a smart lock
   */
  async lockDoor(lockId, accessToken) {
    // Validate access first
    const validationResult = await this.validateAccess(lockId, accessToken);
    
    if (!validationResult.isValid) {
      throw new Error(`Access denied: ${validationResult.reason}`);
    }
    
    const lock = await this.getLock(lockId);
    
    // Lock the door
    lock.status = 'locked';
    this.locks.set(lockId, lock);
    
    // Record lock event in history
    this.accessHistory.push({
      lockId,
      type: 'door_locked',
      accessToken,
      timestamp: new Date().toISOString(),
    });
    
    return {
      success: true,
      lockId,
      status: lock.status,
      message: 'Door locked successfully',
    };
  }

  /**
   * Get access history for a smart lock
   */
  async getAccessHistory(lockId) {
    await this.getLock(lockId); // Verify lock exists
    
    return this.accessHistory.filter(entry => entry.lockId === lockId);
  }

  /**
   * Detect unauthorized access attempts
   * This method would be used by an AI system monitoring access patterns
   */
  async detectUnauthorizedAccess(ownerPublicKey, lockId) {
    // This is a simulated detection for the hackathon
    // In a real implementation, this would use AI to analyze access patterns
    
    // Mock unauthorized access detection
    const detectionResult = {
      detected: Math.random() > 0.7, // 30% chance of detecting unauthorized access in this simulation
      confidence: Math.random() * 100,
      lockId,
      ownerPublicKey,
      timestamp: new Date().toISOString(),
    };
    
    if (detectionResult.detected) {
      // Record unauthorized access attempt in history
      this.accessHistory.push({
        lockId,
        type: 'unauthorized_access_detected',
        perpetrator: ownerPublicKey,
        confidence: detectionResult.confidence,
        timestamp: detectionResult.timestamp,
      });
    }
    
    return detectionResult;
  }
}

// Export singleton instance
const smartLockService = new SmartLockService();
module.exports = smartLockService;