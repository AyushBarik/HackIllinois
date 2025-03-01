import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  Button,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  useColorModeValue,
  Badge,
  Divider
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { smartLockAPI } from '../services/api';
import { useWallet } from '../context/WalletContext';
import SmartLockCard from '../components/SmartLockCard';

// Mock digital keys for demo
const mockDigitalKeys = [
  {
    id: 'key1',
    propertyId: 1,
    propertyName: 'Beach House',
    lockId: 'LOCK123',
    accessToken: 'access_xxxxxx123456',
    issuedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days from now
    status: 'active'
  },
  {
    id: 'key2',
    propertyId: 2,
    propertyName: 'Mountain Cabin',
    lockId: 'LOCK456',
    accessToken: 'access_yyyyyy654321',
    issuedAt: new Date(Date.now() - 30 * 86400000).toISOString(), // 30 days ago
    validUntil: new Date(Date.now() - 23 * 86400000).toISOString(), // 23 days ago
    status: 'expired'
  }
];

// Mock locks for demo
const mockLocks = {
  'LOCK123': {
    id: 'LOCK123',
    name: 'Beach House Front Door',
    status: 'locked',
    battery: 92,
    lastConnected: new Date().toISOString(),
    currentAccess: {
      accessToken: 'access_xxxxxx123456',
      tenantPublicKey: 'mock_tenant_key',
      grantedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
    }
  },
  'LOCK456': {
    id: 'LOCK456',
    name: 'Mountain Cabin Main Entrance',
    status: 'locked',
    battery: 78,
    lastConnected: new Date(Date.now() - 23 * 86400000).toISOString(),
    currentAccess: null
  }
};

const DigitalKeys: React.FC = () => {
  const [digitalKeys, setDigitalKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locks, setLocks] = useState<Record<string, any>>({});
  const { isConnected, publicKey, walletType } = useWallet();
  const navigate = useNavigate();
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Fetch digital keys on component mount
  useEffect(() => {
    if (isConnected && publicKey) {
      fetchDigitalKeys();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, publicKey]);
  
  // For demo, we'll use mock data
  const fetchDigitalKeys = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would fetch from the API
      // For demo, use mock data
      
      // Filter keys based on wallet type
      let keys = [...mockDigitalKeys];
      
      setDigitalKeys(keys);
      setLocks(mockLocks);
    } catch (error) {
      console.error('Error fetching digital keys:', error);
      setError('Failed to load your digital keys. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };
  
  // Check if a key is active
  const isKeyActive = (validUntil: string) => {
    return new Date(validUntil) > new Date();
  };
  
  // Handle refresh locks
  const handleRefreshLocks = async () => {
    toast({
      title: 'Refreshing locks...',
      status: 'info',
      duration: 2000,
      isClosable: true
    });
    
    await fetchDigitalKeys();
  };
  
  if (!isConnected) {
    return (
      <Container maxW="1200px" py={10}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          Please connect your wallet to view your digital keys
        </Alert>
        <Button mt={4} colorScheme="blue" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }
  
  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }
  
  return (
    <Box as="main" py={8} px={4}>
      <Container maxW="1200px">
        {/* Header */}
        <VStack spacing={4} mb={10} align="start">
          <Heading as="h1" size="xl">
            Your Digital Keys
          </Heading>
          <Text color="gray.600">
            View and manage your blockchain-secured digital keys for properties
          </Text>
          <HStack>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={handleRefreshLocks}
            >
              Refresh Locks
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/properties')}
            >
              Browse Properties
            </Button>
          </HStack>
        </VStack>
        
        {error ? (
          <Alert status="error" borderRadius="md" mb={6}>
            <AlertIcon />
            {error}
          </Alert>
        ) : digitalKeys.length === 0 ? (
          <Box
            p={8}
            borderRadius="lg"
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            textAlign="center"
          >
            <VStack spacing={4}>
              <Text fontSize="lg">You don't have any digital keys yet</Text>
              <Button 
                colorScheme="blue" 
                onClick={() => navigate('/properties')}
              >
                Browse Properties
              </Button>
            </VStack>
          </Box>
        ) : (
          <VStack spacing={8} align="stretch">
            {/* Active Keys */}
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Active Keys
              </Heading>
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={6}
              >
                {digitalKeys
                  .filter(key => isKeyActive(key.validUntil))
                  .map(key => (
                    <Box
                      key={key.id}
                      p={5}
                      borderWidth="1px"
                      borderRadius="lg"
                      bg={cardBg}
                      borderColor="green.200"
                      boxShadow="md"
                    >
                      <VStack align="start" spacing={3}>
                        <HStack justify="space-between" w="100%">
                          <Heading size="md">{key.propertyName}</Heading>
                          <Badge colorScheme="green">Active</Badge>
                        </HStack>
                        
                        <Text fontSize="sm" color="gray.500">
                          Valid until: {formatDate(key.validUntil)}
                        </Text>
                        
                        <Divider />
                        
                        <SmartLockCard
                          lock={locks[key.lockId]}
                          accessToken={key.accessToken}
                          onStatusChange={handleRefreshLocks}
                        />
                      </VStack>
                    </Box>
                  ))}
                  
                {digitalKeys.filter(key => isKeyActive(key.validUntil)).length === 0 && (
                  <Text color="gray.500">No active keys</Text>
                )}
              </Grid>
            </Box>
            
            {/* Expired Keys */}
            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Expired Keys
              </Heading>
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap={6}
              >
                {digitalKeys
                  .filter(key => !isKeyActive(key.validUntil))
                  .map(key => (
                    <Box
                      key={key.id}
                      p={5}
                      borderWidth="1px"
                      borderRadius="lg"
                      bg={cardBg}
                      borderColor={borderColor}
                      opacity={0.7}
                    >
                      <VStack align="start" spacing={3}>
                        <HStack justify="space-between" w="100%">
                          <Heading size="md">{key.propertyName}</Heading>
                          <Badge colorScheme="gray">Expired</Badge>
                        </HStack>
                        
                        <Text fontSize="sm" color="gray.500">
                          Expired on: {formatDate(key.validUntil)}
                        </Text>
                        
                        <Button 
                          colorScheme="blue" 
                          size="sm"
                          onClick={() => navigate(`/properties/${key.propertyId}`)}
                        >
                          View Property
                        </Button>
                      </VStack>
                    </Box>
                  ))}
                  
                {digitalKeys.filter(key => !isKeyActive(key.validUntil)).length === 0 && (
                  <Text color="gray.500">No expired keys</Text>
                )}
              </Grid>
            </Box>
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default DigitalKeys;