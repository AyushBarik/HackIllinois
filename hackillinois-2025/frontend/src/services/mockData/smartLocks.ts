import { SmartLockData } from '../apiAdapter';

// Mock data for smart locks
export const mockSmartLocksData: SmartLockData[] = [
  {
    id: 'lock-1',
    propertyId: 1,
    isLocked: true,
    accessHistory: [
      {
        timestamp: '2025-02-20T14:22:10.000Z',
        user: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        action: 'unlock',
        authorized: true
      },
      {
        timestamp: '2025-02-20T14:45:18.000Z',
        user: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        action: 'lock',
        authorized: true
      }
    ],
    authorizedUsers: ['Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'],
    batteryLevel: 87,
    status: 'online'
  },
  {
    id: 'lock-2',
    propertyId: 2,
    isLocked: true,
    accessHistory: [
      {
        timestamp: '2025-02-19T10:15:33.000Z',
        user: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        action: 'unlock',
        authorized: true
      },
      {
        timestamp: '2025-02-19T10:45:12.000Z',
        user: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        action: 'lock',
        authorized: true
      }
    ],
    authorizedUsers: ['Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'],
    batteryLevel: 92,
    status: 'online'
  },
  {
    id: 'lock-3',
    propertyId: 3,
    isLocked: true,
    accessHistory: [
      {
        timestamp: '2025-02-21T16:30:45.000Z',
        user: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        action: 'unlock',
        authorized: true
      },
      {
        timestamp: '2025-02-21T16:55:20.000Z',
        user: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        action: 'lock',
        authorized: true
      }
    ],
    authorizedUsers: ['Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'],
    batteryLevel: 78,
    status: 'online'
  },
  {
    id: 'lock-4',
    propertyId: 4,
    isLocked: true,
    accessHistory: [
      {
        timestamp: '2025-02-15T09:12:33.000Z',
        user: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        action: 'unlock',
        authorized: true
      },
      {
        timestamp: '2025-02-15T09:45:18.000Z',
        user: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        action: 'lock',
        authorized: true
      },
      {
        timestamp: '2025-02-15T12:30:22.000Z',
        user: 'Demo5TenantXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        action: 'unlock',
        authorized: true
      },
      {
        timestamp: '2025-02-15T12:45:10.000Z',
        user: 'Demo5TenantXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        action: 'lock',
        authorized: true
      },
      {
        timestamp: '2025-02-18T22:10:45.000Z',
        user: 'unknown',
        action: 'unlock',
        authorized: false
      }
    ],
    authorizedUsers: [
      'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      'Demo5TenantXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    ],
    batteryLevel: 65,
    status: 'online'
  },
  {
    id: 'lock-5',
    propertyId: 5,
    isLocked: true,
    accessHistory: [
      {
        timestamp: '2025-02-22T08:45:10.000Z',
        user: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        action: 'unlock',
        authorized: true
      },
      {
        timestamp: '2025-02-22T09:15:30.000Z',
        user: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        action: 'lock',
        authorized: true
      }
    ],
    authorizedUsers: ['Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'],
    batteryLevel: 95,
    status: 'online'
  }
];