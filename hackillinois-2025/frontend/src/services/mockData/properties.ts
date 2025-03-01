import { PropertyData } from '../apiAdapter';

// Mock data for properties
export const mockPropertiesData: PropertyData[] = [
  {
    id: 1,
    title: 'Modern Downtown Apartment',
    description: 'Sleek modern apartment in the heart of downtown with amazing city views. Features include high ceilings, hardwood floors, and state-of-the-art appliances.',
    location: 'Chicago, IL',
    price: 175,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
    ],
    owner: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    amenities: ['Wifi', 'Kitchen', 'Workspace', 'Air conditioning', 'Smart Lock'],
    availability: true,
    smartLockId: 'lock-1',
  },
  {
    id: 2,
    title: 'Cozy Studio Near Campus',
    description: 'Perfect for students! This cozy studio is within walking distance to the university campus, restaurants, and shops.',
    location: 'Urbana-Champaign, IL',
    price: 85,
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
    ],
    owner: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    amenities: ['Wifi', 'Kitchen', 'Laundry', 'Smart Lock'],
    availability: true,
    smartLockId: 'lock-2',
  },
  {
    id: 3,
    title: 'Luxury Lakefront Condo',
    description: 'Stunning lakefront condo with panoramic views of Lake Michigan. Features include a private balcony, high-end finishes, and 24/7 doorman.',
    location: 'Chicago, IL',
    price: 250,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
      'https://images.unsplash.com/photo-1501183638710-841dd1904471',
    ],
    owner: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    amenities: ['Wifi', 'Kitchen', 'Pool', 'Gym', 'Parking', 'Smart Lock'],
    availability: true,
    smartLockId: 'lock-3',
  },
  {
    id: 4,
    title: 'Charming Bungalow with Garden',
    description: 'Charming historic bungalow with a beautiful garden. Quiet neighborhood close to parks and public transportation.',
    location: 'Evanston, IL',
    price: 120,
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
    ],
    owner: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    amenities: ['Wifi', 'Kitchen', 'Garden', 'Parking', 'Smart Lock'],
    availability: false,
    smartLockId: 'lock-4',
    currentTenant: 'Demo5TenantXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    rentalStart: '2025-02-15T00:00:00.000Z',
    rentalEnd: '2025-03-15T00:00:00.000Z',
  },
  {
    id: 5,
    title: 'Tech-Enabled Smart Apartment',
    description: 'Fully automated smart apartment with voice control, remote access, and energy-efficient systems. Perfect for tech enthusiasts!',
    location: 'Chicago, IL',
    price: 200,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
    ],
    owner: 'Demo5OwnerXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    amenities: ['Wifi', 'Smart Home', 'Kitchen', 'Workspace', 'Smart Lock', 'Security Cameras'],
    availability: true,
    smartLockId: 'lock-5',
  }
];