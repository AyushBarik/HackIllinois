/**
 * Property Routes
 * Handles API endpoints for property management
 */

const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');
const { formatResponse } = require('../utils/helpers');

// Get all properties (mock implementation)
router.get('/', async (req, res) => {
  try {
    // In a real implementation, this would fetch properties from a database
    // For now, we'll return mock data
    const properties = [
      {
        id: 1,
        name: 'Beach House',
        description: 'Beautiful beach house with ocean view',
        price_per_day: 1000000000, // 1 SOL in lamports
        min_duration: 1,
        max_duration: 30,
        smart_lock_id: 'LOCK123',
        is_available: true,
        owner: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe5tHgP',
        location: {
          address: '123 Ocean Drive',
          city: 'Miami',
          state: 'FL',
          zip: '33139',
          country: 'USA',
          coordinates: {
            latitude: 25.7617,
            longitude: -80.1918
          }
        },
        images: [
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2',
          'https://images.unsplash.com/photo-1518563259479-d003c05a6507'
        ],
        amenities: ['Wi-Fi', 'Kitchen', 'Pool', 'Beachfront']
      },
      {
        id: 2,
        name: 'Mountain Cabin',
        description: 'Cozy cabin in the mountains with stunning views',
        price_per_day: 500000000, // 0.5 SOL in lamports
        min_duration: 2,
        max_duration: 14,
        smart_lock_id: 'LOCK456',
        is_available: true,
        owner: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe5tHgP',
        location: {
          address: '456 Mountain Trail',
          city: 'Aspen',
          state: 'CO',
          zip: '81611',
          country: 'USA',
          coordinates: {
            latitude: 39.1911,
            longitude: -106.8175
          }
        },
        images: [
          'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'
        ],
        amenities: ['Wi-Fi', 'Fireplace', 'Hot Tub', 'Mountain Views']
      }
    ];
    
    res.json(formatResponse(true, { properties }));
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json(formatResponse(false, null, 'Failed to fetch properties'));
  }
});

// Get a specific property
router.get('/:id', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    
    // Mock data for demo
    const property = {
      id: propertyId,
      name: propertyId === 1 ? 'Beach House' : 'Mountain Cabin',
      description: propertyId === 1 
        ? 'Beautiful beach house with ocean view'
        : 'Cozy cabin in the mountains with stunning views',
      price_per_day: propertyId === 1 ? 1000000000 : 500000000,
      min_duration: propertyId === 1 ? 1 : 2,
      max_duration: propertyId === 1 ? 30 : 14,
      smart_lock_id: propertyId === 1 ? 'LOCK123' : 'LOCK456',
      is_available: true,
      owner: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe5tHgP',
      location: {
        address: propertyId === 1 ? '123 Ocean Drive' : '456 Mountain Trail',
        city: propertyId === 1 ? 'Miami' : 'Aspen',
        state: propertyId === 1 ? 'FL' : 'CO',
        zip: propertyId === 1 ? '33139' : '81611',
        country: 'USA',
        coordinates: {
          latitude: propertyId === 1 ? 25.7617 : 39.1911,
          longitude: propertyId === 1 ? -80.1918 : -106.8175
        }
      },
      images: propertyId === 1
        ? ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2', 'https://images.unsplash.com/photo-1518563259479-d003c05a6507']
        : ['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'],
      amenities: propertyId === 1
        ? ['Wi-Fi', 'Kitchen', 'Pool', 'Beachfront']
        : ['Wi-Fi', 'Fireplace', 'Hot Tub', 'Mountain Views']
    };
    
    if (propertyId !== 1 && propertyId !== 2) {
      return res.status(404).json(formatResponse(false, null, 'Property not found'));
    }
    
    res.json(formatResponse(true, { property }));
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json(formatResponse(false, null, 'Failed to fetch property'));
  }
});

// Create a new property
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      price_per_day,
      min_duration,
      max_duration,
      smart_lock_id,
      owner,
      location,
      images,
      amenities
    } = req.body;
    
    // Validate required fields
    if (!name || !price_per_day || !owner || !smart_lock_id) {
      return res.status(400).json(formatResponse(false, null, 'Missing required fields'));
    }
    
    // In a real implementation, we would:
    // 1. Store the property details in a database
    // 2. Register the property on the blockchain
    
    // Register property on blockchain
    const result = await blockchainService.listProperty(owner, {
      name,
      description,
      price_per_day,
      min_duration,
      max_duration,
      smart_lock_id
    });
    
    // Return the created property
    const newProperty = {
      id: result.propertyId,
      name,
      description,
      price_per_day,
      min_duration,
      max_duration,
      smart_lock_id,
      is_available: true,
      owner,
      location,
      images,
      amenities,
      blockchain_tx: result.transactionSignature
    };
    
    res.status(201).json(formatResponse(true, { property: newProperty }));
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json(formatResponse(false, null, 'Failed to create property'));
  }
});

// Book a property
router.post('/:id/book', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const { tenant, duration_days } = req.body;
    
    // Validate required fields
    if (!tenant || !duration_days) {
      return res.status(400).json(formatResponse(false, null, 'Missing required fields'));
    }
    
    // In a real implementation, we would:
    // 1. Check if the property is available
    // 2. Book the property on the blockchain
    // 3. Update the property status in the database
    
    // Book property on blockchain
    const result = await blockchainService.bookProperty(tenant, propertyId, duration_days);
    
    // Return booking details
    const booking = {
      id: result.rentalId,
      property_id: propertyId,
      tenant,
      duration_days,
      start_date: result.rentalStart,
      end_date: result.rentalEnd,
      total_price: propertyId === 1 ? 1000000000 * duration_days : 500000000 * duration_days,
      status: 'confirmed',
      blockchain_tx: result.transactionSignature
    };
    
    res.status(200).json(formatResponse(true, { booking }));
  } catch (error) {
    console.error('Error booking property:', error);
    res.status(500).json(formatResponse(false, null, 'Failed to book property'));
  }
});

// Generate access key for a property
router.post('/:id/access', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const { tenant } = req.body;
    
    // Validate required fields
    if (!tenant) {
      return res.status(400).json(formatResponse(false, null, 'Missing tenant information'));
    }
    
    // Generate digital key on blockchain
    const result = await blockchainService.generateDigitalKey(tenant, propertyId);
    
    res.status(200).json(formatResponse(true, { 
      access_key: result.digitalKey,
      blockchain_tx: result.transactionSignature
    }));
  } catch (error) {
    console.error('Error generating access key:', error);
    res.status(500).json(formatResponse(false, null, 'Failed to generate access key'));
  }
});

// Complete a rental and release funds
router.post('/:id/complete', async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    
    // Release funds on blockchain
    const result = await blockchainService.releaseFunds(propertyId);
    
    res.status(200).json(formatResponse(true, { 
      property_id: propertyId,
      completed_at: result.releasedAt,
      blockchain_tx: result.transactionSignature
    }));
  } catch (error) {
    console.error('Error completing rental:', error);
    res.status(500).json(formatResponse(false, null, 'Failed to complete rental'));
  }
});

module.exports = router;