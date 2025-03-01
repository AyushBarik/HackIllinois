import api, { propertyAPI, smartLockAPI } from './api';
import { mockPropertiesData } from './mockData/properties';
import { mockSmartLocksData } from './mockData/smartLocks';
import { mockTransactionsData } from './mockData/transactions';

// Type definitions for the adapter
export interface PropertyData {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  owner: string;
  amenities: string[];
  availability: boolean;
  smartLockId?: string;
  currentTenant?: string;
  rentalStart?: string;
  rentalEnd?: string;
}

export interface SmartLockData {
  id: string;
  propertyId: number;
  isLocked: boolean;
  accessHistory: {
    timestamp: string;
    user: string;
    action: 'lock' | 'unlock';
    authorized: boolean;
  }[];
  authorizedUsers: string[];
  batteryLevel: number;
  status: 'online' | 'offline';
}

export interface TransactionData {
  id: string;
  type: 'booking' | 'payment' | 'refund' | 'deposit';
  amount: number;
  from: string;
  to: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  propertyId: number;
  description: string;
}

export interface AccessKeyData {
  id: string;
  propertyId: number;
  propertyTitle: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  lastUsed?: string;
}

// Main API adapter class
class ApiAdapter {
  isDemoMode: boolean;

  constructor(isDemoMode = true) {
    this.isDemoMode = isDemoMode;
  }

  setMode(isDemoMode: boolean) {
    this.isDemoMode = isDemoMode;
  }

  // Properties API

  async getAllProperties(): Promise<PropertyData[]> {
    if (this.isDemoMode) {
      return mockPropertiesData;
    } else {
      const response = await propertyAPI.getAllProperties();
      return response.data;
    }
  }

  async getPropertyById(id: number): Promise<PropertyData> {
    if (this.isDemoMode) {
      const property = mockPropertiesData.find(p => p.id === id);
      if (!property) {
        throw new Error(`Property with ID ${id} not found`);
      }
      return property;
    } else {
      const response = await propertyAPI.getPropertyById(id);
      return response.data;
    }
  }

  async createProperty(propertyData: Partial<PropertyData>): Promise<PropertyData> {
    if (this.isDemoMode) {
      // Create a new mock property with a unique ID
      const newId = Math.max(...mockPropertiesData.map(p => p.id)) + 1;
      const newProperty = {
        id: newId,
        title: propertyData.title || 'New Property',
        description: propertyData.description || 'No description provided',
        location: propertyData.location || 'Unknown location',
        price: propertyData.price || 0,
        images: propertyData.images || [],
        owner: propertyData.owner || 'unknown',
        amenities: propertyData.amenities || [],
        availability: propertyData.availability !== undefined ? propertyData.availability : true,
      } as PropertyData;
      
      // Add the property to the mock data
      mockPropertiesData.push(newProperty);
      return newProperty;
    } else {
      const response = await propertyAPI.createProperty(propertyData);
      return response.data;
    }
  }

  async bookProperty(propertyId: number, bookingData: any): Promise<any> {
    if (this.isDemoMode) {
      // Find the property to update
      const propertyIndex = mockPropertiesData.findIndex(p => p.id === propertyId);
      if (propertyIndex === -1) {
        throw new Error(`Property with ID ${propertyId} not found`);
      }
      
      // Update the property
      mockPropertiesData[propertyIndex] = {
        ...mockPropertiesData[propertyIndex],
        availability: false,
        currentTenant: bookingData.tenant,
        rentalStart: bookingData.startDate,
        rentalEnd: bookingData.endDate
      };
      
      // Create a mock transaction
      const newTransaction: TransactionData = {
        id: `tx-${Date.now()}`,
        type: 'booking' as 'booking', // Explicitly type as a literal type
        amount: mockPropertiesData[propertyIndex].price,
        from: bookingData.tenant,
        to: mockPropertiesData[propertyIndex].owner,
        timestamp: new Date().toISOString(),
        status: 'completed' as 'completed', // Explicitly type status too
        propertyId: propertyId,
        description: `Booking for ${mockPropertiesData[propertyIndex].title}`
      };
      
      mockTransactionsData.push(newTransaction);
      
      return {
        success: true,
        property: mockPropertiesData[propertyIndex],
        transaction: newTransaction
      };
    } else {
      const response = await propertyAPI.bookProperty(propertyId, bookingData);
      return response.data;
    }
  }

  async generateAccessKey(propertyId: number, tenantData: any): Promise<AccessKeyData> {
    if (this.isDemoMode) {
      const property = mockPropertiesData.find(p => p.id === propertyId);
      if (!property) {
        throw new Error(`Property with ID ${propertyId} not found`);
      }
      
      // Create a mock access key
      const accessKey: AccessKeyData = {
        id: `key-${Date.now()}`,
        propertyId: propertyId,
        propertyTitle: property.title,
        validFrom: tenantData.startDate || new Date().toISOString(),
        validTo: tenantData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
      };
      
      return accessKey;
    } else {
      const response = await propertyAPI.generateAccessKey(propertyId, tenantData);
      return response.data;
    }
  }

  // Smart Lock API

  async getAllLocks(): Promise<SmartLockData[]> {
    if (this.isDemoMode) {
      return mockSmartLocksData;
    } else {
      const response = await smartLockAPI.getAllLocks();
      return response.data;
    }
  }

  async getLockById(lockId: string): Promise<SmartLockData> {
    if (this.isDemoMode) {
      const lock = mockSmartLocksData.find(l => l.id === lockId);
      if (!lock) {
        throw new Error(`Smart lock with ID ${lockId} not found`);
      }
      return lock;
    } else {
      const response = await smartLockAPI.getLockById(lockId);
      return response.data;
    }
  }

  async unlockDoor(lockId: string, accessToken: string): Promise<boolean> {
    if (this.isDemoMode) {
      const lockIndex = mockSmartLocksData.findIndex(l => l.id === lockId);
      if (lockIndex === -1) {
        throw new Error(`Smart lock with ID ${lockId} not found`);
      }
      
      // Add to access history
      const newAccessRecord = {
        timestamp: new Date().toISOString(),
        user: 'current-user', // In a real app, this would be the user's ID
        action: 'unlock' as const,
        authorized: true
      };
      
      mockSmartLocksData[lockIndex].accessHistory.push(newAccessRecord);
      mockSmartLocksData[lockIndex].isLocked = false;
      
      return true;
    } else {
      const response = await smartLockAPI.unlockDoor(lockId, accessToken);
      return response.data.success;
    }
  }

  async lockDoor(lockId: string, accessToken: string): Promise<boolean> {
    if (this.isDemoMode) {
      const lockIndex = mockSmartLocksData.findIndex(l => l.id === lockId);
      if (lockIndex === -1) {
        throw new Error(`Smart lock with ID ${lockId} not found`);
      }
      
      // Add to access history
      const newAccessRecord = {
        timestamp: new Date().toISOString(),
        user: 'current-user', // In a real app, this would be the user's ID
        action: 'lock' as const,
        authorized: true
      };
      
      mockSmartLocksData[lockIndex].accessHistory.push(newAccessRecord);
      mockSmartLocksData[lockIndex].isLocked = true;
      
      return true;
    } else {
      const response = await smartLockAPI.lockDoor(lockId, accessToken);
      return response.data.success;
    }
  }

  async getAccessHistory(lockId: string): Promise<any[]> {
    if (this.isDemoMode) {
      const lock = mockSmartLocksData.find(l => l.id === lockId);
      if (!lock) {
        throw new Error(`Smart lock with ID ${lockId} not found`);
      }
      
      return lock.accessHistory;
    } else {
      const response = await smartLockAPI.getAccessHistory(lockId);
      return response.data;
    }
  }

  // Transactions API

  async getTransactions(): Promise<TransactionData[]> {
    if (this.isDemoMode) {
      return mockTransactionsData;
    } else {
      // Assuming there's a transactions endpoint in the real API
      const response = await api.get('/transactions');
      return response.data;
    }
  }

  async getTransactionsByUser(userId: string): Promise<TransactionData[]> {
    if (this.isDemoMode) {
      return mockTransactionsData.filter(
        tx => tx.from === userId || tx.to === userId
      );
    } else {
      // Assuming there's a user transactions endpoint in the real API
      const response = await api.get(`/transactions/user/${userId}`);
      return response.data;
    }
  }
}

// Export a singleton instance
const apiAdapter = new ApiAdapter(true); // Default to demo mode
export default apiAdapter;