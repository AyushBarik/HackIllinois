import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Image,
  Heading,
  Text,
  Grid,
  GridItem,
  Badge,
  Button,
  HStack,
  VStack,
  useToast,
  Divider,
  Flex,
  Icon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  Spinner,
  Center
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import { useWallet } from '../context/WalletContext';
import SmartLockCard from '../components/SmartLockCard';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const navigate = useNavigate();
  const { isConnected, publicKey, walletType } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [property, setProperty] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // Fetch property details on component mount
  useEffect(() => {
    if (id) {
      fetchPropertyDetails(parseInt(id));
    }
  }, [id]);
  
  // Fetch property details from API
  const fetchPropertyDetails = async (propertyId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await propertyAPI.getPropertyById(propertyId);
      
      if (response.success && response.data.property) {
        setProperty(response.data.property);
      } else {
        setError('Failed to load property details');
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      setError('Failed to load property details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format price from lamports (1 SOL = 1,000,000,000 lamports)
  const formatPrice = (lamports: number) => {
    return (lamports / 1000000000).toFixed(2);
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!property) return 0;
    return property.price_per_day * duration;
  };
  
  // Handle booking property
  const handleBookProperty = async () => {
    if (!isConnected || !publicKey) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to book this property',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    if (walletType !== 'tenant') {
      toast({
        title: 'Wrong wallet type',
        description: 'Please switch to tenant wallet to book properties',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    setIsBooking(true);
    
    try {
      const response = await propertyAPI.bookProperty(parseInt(id!), {
        tenant: publicKey,
        duration_days: duration
      });
      
      if (response.success) {
        toast({
          title: 'Booking successful',
          description: 'Property booked successfully. Generating digital key...',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        
        // Generate digital key
        const keyResponse = await propertyAPI.generateAccessKey(parseInt(id!), {
          tenant: publicKey
        });
        
        if (keyResponse.success) {
          setAccessToken(keyResponse.data.access_key.accessToken);
          onOpen(); // Open modal with digital key
          
          // Refresh property to show it's no longer available
          fetchPropertyDetails(parseInt(id!));
        }
      } else {
        toast({
          title: 'Booking failed',
          description: response.error || 'Failed to book property',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error booking property:', error);
      toast({
        title: 'Booking failed',
        description: 'An error occurred while booking the property',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsBooking(false);
    }
  };
  
  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }
  
  if (error || !property) {
    return (
      <Container maxW="1200px" py={10}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error || 'Property not found'}
        </Alert>
        <Button mt={4} onClick={() => navigate('/properties')}>
          Back to Properties
        </Button>
      </Container>
    );
  }
  
  return (
    <Box as="main" py={8} px={4}>
      <Container maxW="1200px">
        {/* Property Header */}
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8} mb={10}>
          {/* Property Image */}
          <GridItem>
            <Image 
              src={property.images[0] || 'https://via.placeholder.com/800x500?text=Property'} 
              alt={property.name}
              borderRadius="lg"
              objectFit="cover"
              w="100%"
              h={{ base: '300px', md: '400px' }}
            />
          </GridItem>
          
          {/* Property Info */}
          <GridItem>
            <VStack align="start" spacing={4}>
              <Badge 
                colorScheme={property.is_available ? 'green' : 'red'}
                fontSize="0.8em"
                px={2}
                py={1}
                borderRadius="md"
              >
                {property.is_available ? 'Available' : 'Booked'}
              </Badge>
              
              <Heading as="h1" size="xl">
                {property.name}
              </Heading>
              
              <HStack>
                <Text fontSize="sm" color="gray.500">
                  {property.location.address}
                </Text>
              </HStack>
              
              <Text color="gray.500">
                {property.location.city}, {property.location.state}
              </Text>
              
              <HStack>
                <Text fontWeight="bold" fontSize="2xl">
                  {formatPrice(property.price_per_day)} SOL
                </Text>
                <Text fontSize="md" color="gray.500">
                  / day
                </Text>
              </HStack>
              
              <Text fontSize="sm">
                Minimum stay: {property.min_duration} days
              </Text>
              <Text fontSize="sm">
                Maximum stay: {property.max_duration} days
              </Text>
              
              <Divider />
              
              {property.is_available ? (
                <VStack w="100%" align="start" spacing={4}>
                  <Text fontWeight="semibold">Book this property:</Text>
                  
                  <HStack w="100%">
                    <Text>Duration (days):</Text>
                    <NumberInput 
                      min={property.min_duration} 
                      max={property.max_duration} 
                      value={duration}
                      onChange={(value) => setDuration(Number(value))}
                      w="100px"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>
                  
                  <Box w="100%" p={3} bg="blue.50" borderRadius="md">
                    <HStack justify="space-between">
                      <Text>Total Price:</Text>
                      <Text fontWeight="bold">
                        {formatPrice(calculateTotalPrice())} SOL
                      </Text>
                    </HStack>
                  </Box>
                  
                  <Button 
                    w="100%" 
                    colorScheme="blue"
                    onClick={handleBookProperty}
                    isLoading={isBooking}
                    loadingText="Booking..."
                    isDisabled={!isConnected || !property.is_available}
                  >
                    Book Now with Blockchain
                  </Button>
                  
                  {!isConnected && (
                    <Alert status="warning" borderRadius="md">
                      <AlertIcon />
                      Please connect your wallet to book this property
                    </Alert>
                  )}
                </VStack>
              ) : (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  This property is currently booked
                </Alert>
              )}
            </VStack>
          </GridItem>
        </Grid>
        
        {/* Property Description */}
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4}>
            Description
          </Heading>
          <Text>{property.description}</Text>
        </Box>
        
        {/* Amenities */}
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4}>
            Amenities
          </Heading>
          <Flex flexWrap="wrap" gap={2}>
            {property.amenities.map((amenity: string, index: number) => (
              <Badge 
                key={index}
                colorScheme="blue"
                variant="outline"
                py={1}
                px={3}
                borderRadius="full"
              >
                {amenity}
              </Badge>
            ))}
          </Flex>
        </Box>
        
        {/* Smart Lock */}
        {accessToken && (
          <Box mb={10}>
            <Heading as="h2" size="lg" mb={4}>
              Digital Key & Smart Lock
            </Heading>
            <SmartLockCard 
              lock={{
                id: property.smart_lock_id,
                name: `${property.name} Door Lock`,
                status: 'locked',
                battery: 95,
                lastConnected: new Date().toISOString(),
                currentAccess: {
                  accessToken: accessToken,
                  tenantPublicKey: publicKey || '',
                  grantedAt: new Date().toISOString(),
                  validUntil: new Date(Date.now() + duration * 86400000).toISOString(),
                }
              }}
              accessToken={accessToken}
            />
          </Box>
        )}
      </Container>
      
      {/* Digital Key Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your Digital Key is Ready!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="start">
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                Your booking was successful and your payment is securely held in the smart contract escrow.
              </Alert>
              
              <Text>
                You now have access to the property's smart lock. Your digital key is stored on the blockchain
                and will automatically expire at the end of your stay.
              </Text>
              
              <Box
                p={4}
                bg="blue.50"
                borderRadius="md"
                w="100%"
                textAlign="center"
                fontSize="sm"
              >
                <Text fontWeight="bold" mb={2}>Digital Access Token</Text>
                <Text 
                  fontFamily="monospace" 
                  bg="white" 
                  p={2} 
                  borderRadius="md"
                  overflowX="auto"
                >
                  {accessToken}
                </Text>
              </Box>
              
              <Text fontSize="sm" color="gray.600">
                You can access your digital keys at any time from the "Digital Keys" section in your dashboard.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                onClose();
                navigate('/digital-keys');
              }}
            >
              View All Keys
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PropertyDetail;