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

const MyRentals: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, walletType } = useWallet();
  const [rentals, setRentals] = useState<any[]>([]);
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Check if user is connected and is a tenant
  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }
    
    if (walletType !== 'tenant') {
      navigate('/dashboard');
      return;
    }
    
    fetchMyRentals();
  }, [isConnected, walletType]);
  
  // Fetch rentals
  const fetchMyRentals = () => {
    // Mock data for demonstration
    const mockRentals = [
      {
        id: 1,
        property: {
          id: 1,
          name: "Luxury Downtown Apartment",
          description: "Modern apartment in the heart of downtown with city views.",
          price_per_day: 500000000, // 0.5 SOL
          smart_lock_id: "lock-1",
          location: {
            address: "123 Main St",
            city: "San Francisco",
            state: "CA"
          },
          images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"],
          amenities: ["WiFi", "Pool", "Gym", "Parking"],
        },
        start_date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        end_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
        total_price: 3500000000, // 3.5 SOL for 7 days
        status: "active",
        access_key: {
          accessToken: "abc123",
          validUntil: new Date(Date.now() + 86400000 * 5).toISOString(),
        },
        owner: "5tY6...h2Jk"
      }
    ];
    
    setRentals(mockRentals);
  };
  
  // Format SOL amount
  const formatSol = (lamports: number) => {
    return (lamports / 1000000000).toFixed(2);
  };
  
  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'upcoming':
        return 'blue';
      case 'completed':
        return 'gray';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };
  
  // Get days remaining
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Handle view property details
  const handleViewProperty = (propertyId: number) => {
    navigate(`/properties/${propertyId}`);
  };
  
  // Handle view digital keys
  const handleViewKeys = () => {
    navigate('/digital-keys');
  };
  
  // Handle find properties
  const handleFindProperties = () => {
    navigate('/properties');
  };
  
  return (
    <Container maxW="1200px" py={8}>
      <Heading mb={6}>My Rentals</Heading>
      
      {rentals.length > 0 ? (
        <VStack spacing={6} align="stretch">
          {rentals.map(rental => (
            <Box 
              key={rental.id}
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
                  bgImage={`url(${rental.property.images[0]})`}
                  bgSize="cover"
                  bgPosition="center"
                  borderRadius="md"
                />
                
                <Box flex="1">
                  <Flex justify="space-between" align="flex-start" mb={2}>
                    <Heading size="md">{rental.property.name}</Heading>
                    <Badge colorScheme={getStatusColor(rental.status)}>
                      {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                    </Badge>
                  </Flex>
                  
                  <Text fontSize="sm" color="gray.500" mb={2}>
                    {rental.property.location.city}, {rental.property.location.state}
                  </Text>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                    <Box>
                      <Text fontWeight="bold">Rental Period:</Text>
                      <Text>{formatDate(rental.start_date)} to {formatDate(rental.end_date)}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold">Total Price:</Text>
                      <Text>{formatSol(rental.total_price)} SOL</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold">Smart Lock ID:</Text>
                      <Text>{rental.property.smart_lock_id}</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold">Owner:</Text>
                      <Text>{rental.owner}</Text>
                    </Box>
                  </SimpleGrid>
                  
                  <Box 
                    p={3}
                    bg="blue.50"
                    borderRadius="md"
                    mb={4}
                  >
                    <Flex justify="space-between" align="center">
                      <Text fontSize="sm" fontWeight="bold" color="blue.700">
                        {getDaysRemaining(rental.end_date)} days remaining
                      </Text>
                      <Text fontSize="sm" color="blue.700">
                        Digital key valid until: {formatDate(rental.access_key.validUntil)}
                      </Text>
                    </Flex>
                  </Box>
                  
                  <Divider my={4} />
                  
                  <Flex justify="flex-end" gap={4}>
                    <Button
                      variant="outline"
                      onClick={() => handleViewProperty(rental.property.id)}
                    >
                      View Property
                    </Button>
                    <Button
                      colorScheme="blue"
                      onClick={handleViewKeys}
                    >
                      Digital Keys
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
          <Heading size="md" mb={4}>You don't have any active rentals</Heading>
          <Text mb={6}>
            Browse available properties to find your next blockchain-secured rental.
          </Text>
          <Button colorScheme="blue" onClick={handleFindProperties}>
            Find Properties
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default MyRentals;