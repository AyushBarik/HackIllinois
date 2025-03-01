import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  Button,
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { propertyAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import { useWallet } from '../context/WalletContext';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const { isConnected } = useWallet();
  const toast = useToast();
  
  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);
  
  // Fetch properties from API
  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await propertyAPI.getAllProperties();
      if (response.success && response.data.properties) {
        setProperties(response.data.properties);
        setFilteredProperties(response.data.properties);
      } else {
        setError('Failed to load properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter properties based on search term and price filter
  useEffect(() => {
    let filtered = [...properties];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(property => 
        property.name.toLowerCase().includes(search) ||
        property.location.city.toLowerCase().includes(search) ||
        property.location.state.toLowerCase().includes(search) ||
        property.description.toLowerCase().includes(search)
      );
    }
    
    // Apply price filter
    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(p => parseInt(p) * 1000000000);
      filtered = filtered.filter(property => {
        if (priceFilter === '3-plus') {
          return property.price_per_day >= 3 * 1000000000;
        }
        return property.price_per_day >= min && (max ? property.price_per_day <= max : true);
      });
    }
    
    setFilteredProperties(filtered);
  }, [searchTerm, priceFilter, properties]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle price filter change
  const handlePriceFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriceFilter(e.target.value);
  };
  
  return (
    <Box as="main" py={8} px={4}>
      <Container maxW="1200px">
        {/* Header */}
        <Box mb={10} textAlign="center">
          <Heading as="h1" size="xl" mb={3}>
            Explore Available Properties
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Find your next secure stay with blockchain-powered rentals
          </Text>
        </Box>
        
        {/* Filters */}
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          mb={8} 
          gap={4}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
        >
          {/* Search */}
          <InputGroup maxW={{ base: '100%', md: '60%' }}>
            <InputLeftElement pointerEvents="none">
              🔍
            </InputLeftElement>
            <Input 
              placeholder="Search by name, location, or description..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
          
          {/* Price Filter */}
          <Select 
            maxW={{ base: '100%', md: '200px' }}
            value={priceFilter}
            onChange={handlePriceFilterChange}
          >
            <option value="all">All Prices</option>
            <option value="0-1">Under 1 SOL</option>
            <option value="1-2">1 - 2 SOL</option>
            <option value="2-3">2 - 3 SOL</option>
            <option value="3-plus">3+ SOL</option>
          </Select>
        </Flex>
        
        {/* Properties Grid */}
        {isLoading ? (
          <Center py={10}>
            <Spinner size="xl" color="blue.500" />
          </Center>
        ) : error ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        ) : filteredProperties.length === 0 ? (
          <Center py={10}>
            <Box textAlign="center">
              <Text fontSize="lg" mb={4}>No properties found matching your criteria</Text>
              <Button 
                colorScheme="blue" 
                onClick={() => {
                  setSearchTerm('');
                  setPriceFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default Properties;