import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  HStack,
  Flex,
  Badge,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { propertyAPI } from '../services/api';

const MyProperties: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, walletType } = useWallet();
  const [properties, setProperties] = useState<any[]>([]);
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Check if user is connected and is an owner
  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }
    
    if (walletType !== 'owner') {
      navigate('/dashboard');
      return;
    }
    
    fetchMyProperties();
  }, [isConnected, walletType]);
  
  // Fetch properties
  const fetchMyProperties = () => {
    // Mock data for demonstration
    const mockProperties = [
      {
        id: 1,
        name: "Luxury Downtown Apartment",
        description: "Modern apartment in the heart of downtown with city views.",
        price_per_day: 500000000, // 0.5 SOL
        min_duration: 2,
        max_duration: 30,
        smart_lock_id: "lock-1",
        is_available: false,
        owner: "5tY6...h2Jk",
        current_tenant: "8xF3...j9Kl",
        rental_end_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
        location: {
          address: "123 Main St",
          city: "San Francisco",
          state: "CA"
        },
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"],
        amenities: ["WiFi", "Pool", "Gym", "Parking"],
        status: "rented"
      },
      {
        id: 2,
        name: "Beach House",
        description: "Beautiful beach house with ocean views.",
        price_per_day: 750000000, // 0.75 SOL
        min_duration: 3,
        max_duration: 60,
        smart_lock_id: "lock-2",
        is_available: true,
        owner: "5tY6...h2Jk",
        current_tenant: null,
        rental_end_date: null,
        location: {
          address: "456 Ocean Ave",
          city: "Malibu",
          state: "CA"
        },
        images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2"],
        amenities: ["Beach Access", "WiFi", "Air Conditioning", "Balcony"],
        status: "available"
      },
      {
        id: 3,
        name: "Mountain Cabin",
        description: "Cozy cabin in the mountains.",
        price_per_day: 400000000, // 0.4 SOL
        min_duration: 2,
        max_duration: 21,
        smart_lock_id: "lock-3",
        is_available: false,
        owner: "5tY6...h2Jk",
        current_tenant: "3zX9...m5Np",
        rental_end_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
        location: {
          address: "789 Pine Rd",
          city: "Aspen",
          state: "CO"
        },
        images: ["https://images.unsplash.com/photo-1501685532562-aa6846b31a3e"],
        amenities: ["Fireplace", "WiFi", "Hiking Trails", "Hot Tub"],
        status: "rented"
      }
    ];
    
    setProperties(mockProperties);
  };
  
  // Format SOL amount
  const formatSol = (lamports: number) => {
    return (lamports / 1000000000).toFixed(2);
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rented':
        return 'orange';
      case 'available':
        return 'green';
      case 'maintenance':
        return 'red';
      default:
        return 'gray';
    }
  };
  
  // Handle add new property
  const handleAddProperty = () => {
    // In a real app, this would navigate to a form or open a modal
    navigate('/add-property');
  };
  
  // Handle property edit
  const handleEditProperty = (propertyId: number) => {
    navigate(`/edit-property/${propertyId}`);
  };
  
  // Handle view property details
  const handleViewProperty = (propertyId: number) => {
    navigate(`/properties/${propertyId}`);
  };
  
  return (
    <Container maxW="1200px" py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>My Properties</Heading>
        <Button colorScheme="blue" onClick={handleAddProperty}>
          Add New Property
        </Button>
      </Flex>
      
      {properties.length > 0 ? (
        <VStack spacing={6} align="stretch">
          {properties.map(property => (
            <Box 
              key={property.id}
              p={6}
              bg={bgColor}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              boxShadow="md"
            >
              <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
                <Box 
                  width={{ base: '100%', md: '250px' }}
                  height="150px"
                  bgImage={`url(${property.images[0]})`}
                  bgSize="cover"
                  bgPosition="center"
                  borderRadius="md"
                />
                
                <Box flex="1">
                  <Flex justify="space-between" align="flex-start" mb={2}>
                    <Heading size="md">{property.name}</Heading>
                    <Badge colorScheme={getStatusColor(property.status)}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </Badge>
                  </Flex>
                  
                  <Text fontSize="sm" color="gray.500" mb={2}>
                    {property.location.city}, {property.location.state}
                  </Text>
                  
                  <Text noOfLines={2} mb={4}>
                    {property.description}
                  </Text>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                    <Box>
                      <Text fontWeight="bold">Price:</Text>
                      <Text>{formatSol(property.price_per_day)} SOL / day</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold">Duration:</Text>
                      <Text>{property.min_duration} to {property.max_duration} days</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold">Smart Lock:</Text>
                      <Text>{property.smart_lock_id}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold">Current Status:</Text>
                      {property.current_tenant ? (
                        <HStack>
                          <Text>Rented to {property.current_tenant}</Text>
                        </HStack>
                      ) : (
                        <Text>Available</Text>
                      )}
                    </Box>
                  </SimpleGrid>
                  
                  {property.current_tenant && (
                    <Box 
                      p={3}
                      bg="blue.50"
                      borderRadius="md"
                      mb={4}
                    >
                      <Text fontSize="sm" fontWeight="bold" color="blue.700">
                        Rental ends: {new Date(property.rental_end_date).toLocaleDateString()}
                      </Text>
                    </Box>
                  )}
                  
                  <Divider my={4} />
                  
                  <Flex justify="flex-end" gap={4}>
                    <Button
                      variant="outline"
                      onClick={() => handleViewProperty(property.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={() => handleEditProperty(property.id)}
                    >
                      Edit Property
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      ) : (
        <Box 
          p={10} 
          textAlign="center" 
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading size="md" mb={4}>You don't have any properties yet</Heading>
          <Text mb={6}>
            Add your first property to start earning passive income with blockchain-based rentals.
          </Text>
          <Button colorScheme="blue" onClick={handleAddProperty}>
            Add Your First Property
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default MyProperties;