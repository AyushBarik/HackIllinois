/**
 * AI Monitoring Service
 * Monitors smart lock access and detects unauthorized access attempts
 */

const smartLockService = require('./smartLockService');
const blockchainService = require('./blockchainService');

class AIMonitoringService {
  constructor() {
    this.isMonitoring = false;
    this.monitoringIntervalId = null;
    this.alertListeners = [];
    this.detectionThreshold = 70; // Confidence threshold for alerting (0-100)
  }

  /**
   * Start monitoring for unauthorized access
   */
  startMonitoring(intervalMs = 60000) { // Default to checking every minute
    if (this.isMonitoring) {
      console.log('AI monitoring is already running');
      return;
    }
    
    console.log(`Starting AI monitoring with ${intervalMs}ms interval`);
    
    this.isMonitoring = true;
    this.monitoringIntervalId = setInterval(() => this.checkForUnauthorizedAccess(), intervalMs);
    
    return {
      success: true,
      message: 'AI monitoring started successfully',
      interval: intervalMs,
    };
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) {
      console.log('AI monitoring is not running');
      return;
    }
    
    console.log('Stopping AI monitoring');
    
    this.isMonitoring = false;
    clearInterval(this.monitoringIntervalId);
    this.monitoringIntervalId = null;
    
    return {
      success: true,
      message: 'AI monitoring stopped successfully',
    };
  }

  /**
   * Register a callback for unauthorized access alerts
   */
  onUnauthorizedAccess(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }
    
    this.alertListeners.push(callback);
    
    return {
      success: true,
      message: 'Alert listener registered successfully',
      listenerId: this.alertListeners.length - 1,
    };
  }

  /**
   * Remove a callback for unauthorized access alerts
   */
  removeListener(listenerId) {
    if (listenerId < 0 || listenerId >= this.alertListeners.length) {
      throw new Error(`Invalid listener ID: ${listenerId}`);
    }
    
    this.alertListeners.splice(listenerId, 1);
    
    return {
      success: true,
      message: 'Alert listener removed successfully',
    };
  }

  /**
   * Set the confidence threshold for alerts
   */
  setDetectionThreshold(threshold) {
    if (threshold < 0 || threshold > 100) {
      throw new Error('Threshold must be between 0 and 100');
    }
    
    this.detectionThreshold = threshold;
    
    return {
      success: true,
      message: `Detection threshold set to ${threshold}`,
    };
  }

  /**
   * Manually trigger a check for unauthorized access
   */
  async manualCheck() {
    return this.checkForUnauthorizedAccess();
  }

  /**
   * Check for unauthorized access and alert if detected
   * @private
   */
  async checkForUnauthorizedAccess() {
    try {
      console.log('AI monitoring: Checking for unauthorized access...');
      
      // Get all locks
      const locks = await smartLockService.getAllLocks();
      
      // Track detections
      const detections = [];
      
      // Check each lock for unauthorized access
      for (const lock of locks) {
        // Skip locks with no active rental
        if (!lock.currentAccess) {
          continue;
        }
        
        // In a real implementation, this would use machine learning to analyze access patterns
        // For this simulation, we're using the mock detection in the smart lock service
        
        // Simulate the property owner trying to access
        // In a real implementation, we would analyze actual access logs
        const ownerPublicKey = 'SIMULATED_OWNER_' + lock.id;
        
        const detectionResult = await smartLockService.detectUnauthorizedAccess(
          ownerPublicKey,
          lock.id
        );
        
        // If unauthorized access was detected with high confidence, trigger alerts
        if (detectionResult.detected && detectionResult.confidence >= this.detectionThreshold) {
          detections.push(detectionResult);
          
          // Record the violation on the blockchain
          try {
            await blockchainService.recordViolation(
              lock.id, // Using lock ID as a proxy for property ID in this simulation
              'owner_unauthorized_access',
              `Owner attempted access during active rental (confidence: ${detectionResult.confidence.toFixed(2)}%)`
            );
          } catch (error) {
            console.error('Error recording violation on blockchain:', error);
          }
          
          // Notify all listeners
          this.alertListeners.forEach(listener => {
            try {
              listener(detectionResult);
            } catch (error) {
              console.error('Error in alert listener:', error);
            }
          });
        }
      }
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        detectionsCount: detections.length,
        detections,
      };
    } catch (error) {
      console.error('Error checking for unauthorized access:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Analyze access patterns for a specific lock
   */
  async analyzeAccessPatterns(lockId) {
    try {
      // Get access history for the lock
      const accessHistory = await smartLockService.getAccessHistory(lockId);
      
      // This is a simulated analysis for the hackathon
      // In a real implementation, this would use machine learning to analyze patterns
      
      // Count access types
      const accessCounts = {};
      for (const entry of accessHistory) {
        accessCounts[entry.type] = (accessCounts[entry.type] || 0) + 1;
      }
      
      // Calculate time-based statistics
      const timeStats = {
        firstAccess: accessHistory.length > 0 ? new Date(accessHistory[0].timestamp) : null,
        lastAccess: accessHistory.length > 0 ? new Date(accessHistory[accessHistory.length - 1].timestamp) : null,
        accessesPerDay: accessHistory.length > 0 
          ? this._calculateAccessesPerDay(accessHistory) 
          : 0,
      };
      
      // Simple anomaly detection
      const anomalies = this._detectAnomalies(accessHistory);
      
      return {
        success: true,
        lockId,
        accessCount: accessHistory.length,
        accessCounts,
        timeStats,
        anomalies,
        riskScore: this._calculateRiskScore(accessHistory, anomalies),
      };
    } catch (error) {
      console.error('Error analyzing access patterns:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Calculate accesses per day
   * @private
   */
  _calculateAccessesPerDay(accessHistory) {
    if (accessHistory.length < 2) {
      return accessHistory.length;
    }
    
    const firstDate = new Date(accessHistory[0].timestamp);
    const lastDate = new Date(accessHistory[accessHistory.length - 1].timestamp);
    const daysDiff = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    
    return daysDiff > 0 ? accessHistory.length / daysDiff : accessHistory.length;
  }

  /**
   * Detect anomalies in access history
   * @private
   */
  _detectAnomalies(accessHistory) {
    const anomalies = [];
    
    // This is a very simple anomaly detection for the hackathon
    // In a real implementation, this would use more sophisticated algorithms
    
    // Check for unauthorized access attempts
    const unauthorizedAttempts = accessHistory.filter(entry => 
      entry.type === 'unauthorized_access_detected'
    );
    
    if (unauthorizedAttempts.length > 0) {
      anomalies.push({
        type: 'unauthorized_access',
        count: unauthorizedAttempts.length,
        entries: unauthorizedAttempts,
      });
    }
    
    // Check for frequent access validations without unlocks (potential brute force)
    const validations = accessHistory.filter(entry => entry.type === 'access_validated');
    const unlocks = accessHistory.filter(entry => entry.type === 'door_unlocked');
    
    if (validations.length > unlocks.length * 3 && validations.length > 10) {
      anomalies.push({
        type: 'excessive_validations',
        validationCount: validations.length,
        unlockCount: unlocks.length,
        ratio: validations.length / Math.max(1, unlocks.length),
      });
    }
    
    return anomalies;
  }

  /**
   * Calculate a risk score based on access history and anomalies
   * @private
   */
  _calculateRiskScore(accessHistory, anomalies) {
    let score = 0;
    
    // Base score on anomalies
    score += anomalies.length * 25;
    
    // Add points for unauthorized access attempts
    const unauthorizedAttempts = accessHistory.filter(entry => 
      entry.type === 'unauthorized_access_detected'
    );
    score += unauthorizedAttempts.length * 15;
    
    // Add points for excessive validations
    const validations = accessHistory.filter(entry => entry.type === 'access_validated');
    const unlocks = accessHistory.filter(entry => entry.type === 'door_unlocked');
    
    if (validations.length > unlocks.length * 2) {
      score += 10;
    }
    
    // Cap score at 100
    return Math.min(100, score);
  }
}

// Export singleton instance
const aiMonitoringService = new AIMonitoringService();
module.exports = aiMonitoringService;