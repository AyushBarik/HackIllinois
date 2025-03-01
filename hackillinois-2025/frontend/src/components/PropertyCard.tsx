import React from 'react';
import {
  Box,
  Image,
  Badge,
  Text,
  Heading,
  Flex,
  Button,
  VStack,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: {
    id: number;
    name: string;
    description: string;
    price_per_day: number;
    min_duration: number;
    max_duration: number;
    smart_lock_id: string;
    is_available: boolean;
    owner: string;
    location: {
      address: string;
      city: string;
      state: string;
    };
    images: string[];
    amenities: string[];
  };
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Format price from lamports (1 SOL = 1,000,000,000 lamports)
  const formatPrice = (lamports: number) => {
    return (lamports / 1000000000).toFixed(2);
  };
  
  return (
    <Box 
      maxW="sm" 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden"
      bg={cardBg}
      borderColor={borderColor}
      boxShadow="md"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg'
      }}
    >
      {/* Property Image */}
      <Image 
        src={property.images[0] || 'https://via.placeholder.com/400x250?text=Property'} 
        alt={property.name}
        h="200px"
        w="100%"
        objectFit="cover"
      />
      
      {/* Badge for availability */}
      <Box position="absolute" top="10px" right="10px">
        <Badge 
          borderRadius="full" 
          px="2" 
          colorScheme={property.is_available ? 'green' : 'red'}
        >
          {property.is_available ? 'Available' : 'Booked'}
        </Badge>
      </Box>
      
      <Box p={5}>
        <VStack align="start" spacing={3}>
          {/* Property Name */}
          <Heading size="md" lineHeight="tight" isTruncated>
            {property.name}
          </Heading>
          
          {/* Location */}
          <Text fontSize="sm" color="gray.500">
            {property.location.city}, {property.location.state}
          </Text>
          
          {/* Price */}
          <HStack>
            <Text fontWeight="bold" fontSize="xl">
              {formatPrice(property.price_per_day)} SOL
            </Text>
            <Text fontSize="sm" color="gray.500">
              / day
            </Text>
          </HStack>
          
          {/* Duration */}
          <Text fontSize="sm">
            {property.min_duration} to {property.max_duration} days
          </Text>
          
          {/* Amenities */}
          <Box>
            <Flex flexWrap="wrap" gap={2} mt={2}>
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <Badge 
                  key={index} 
                  borderRadius="full" 
                  px={2} 
                  colorScheme="blue"
                  variant="outline"
                >
                  {amenity}
                </Badge>
              ))}
              {property.amenities.length > 3 && (
                <Badge 
                  borderRadius="full" 
                  px={2} 
                  colorScheme="gray"
                  variant="outline"
                >
                  +{property.amenities.length - 3} more
                </Badge>
              )}
            </Flex>
          </Box>
          
          {/* View Details Button */}
          <Button 
            mt={2} 
            colorScheme="blue" 
            w="full"
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            View Details
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default PropertyCard;