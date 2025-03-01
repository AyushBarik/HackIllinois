import { TransactionData } from '../apiAdapter';

// Mock data for transactions with explicit type assertions for TypeScript
export const mockTransactionsData: TransactionData[] = [
  {
    id: 'tx-1',
    type: 'booking' as const,
    amount: 120,
    from: 'Demo5TenantXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    to: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    timestamp: '2025-02-15T08:30:00.000Z',
    status: 'completed' as const,
    propertyId: 4,
    description: 'Booking for Charming Bungalow with Garden'
  },
  {
    id: 'tx-2',
    type: 'deposit' as const,
    amount: 50,
    from: 'Demo5TenantXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    to: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    timestamp: '2025-02-15T08:31:00.000Z',
    status: 'completed' as const,
    propertyId: 4,
    description: 'Security deposit for Charming Bungalow with Garden'
  },
  {
    id: 'tx-3',
    type: 'booking' as const,
    amount: 175,
    from: 'Other5TenantXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    to: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    timestamp: '2025-01-20T14:22:00.000Z',
    status: 'completed' as const,
    propertyId: 1,
    description: 'Booking for Modern Downtown Apartment'
  },
  {
    id: 'tx-4',
    type: 'refund' as const,
    amount: 175,
    from: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    to: 'Other5TenantXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    timestamp: '2025-01-25T10:15:00.000Z',
    status: 'completed' as const,
    propertyId: 1,
    description: 'Cancellation refund for Modern Downtown Apartment'
  },
  {
    id: 'tx-5',
    type: 'payment' as const,
    amount: 250,
    from: 'Demo5TenantXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    to: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    timestamp: '2025-01-10T09:45:00.000Z',
    status: 'completed' as const,
    propertyId: 3,
    description: 'Payment for Luxury Lakefront Condo'
  }
];