import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Image,
  useColorModeValue,
  Icon
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, connect, walletType, setWalletType } = useWallet();
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.600, purple.600)',
    'linear(to-r, blue.800, purple.800)'
  );
  
  const handleExploreProperties = () => {
    navigate('/properties');
  };
  
  const handleConnectWallet = async () => {
    if (!isConnected) {
      await connect();
    }
  };
  
  return (
    <Box as="main">
      {/* Hero Section */}
      <Box 
        bgGradient={bgGradient}
        color="white"
        py={20}
        px={4}
      >
        <Container maxW="1200px">
          <Flex 
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
            gap={10}
          >
            <VStack
              align={{ base: 'center', md: 'flex-start' }}
              spacing={6}
              maxW={{ base: '100%', md: '50%' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              <Heading 
                as="h1" 
                size="2xl"
                lineHeight="1.2"
                fontWeight="bold"
              >
                Secure Your Stay with Blockchain Technology
              </Heading>
              
              <Text fontSize="xl" opacity={0.9}>
                Book properties with smart contracts, access them with digital keys, and enjoy
                the security of blockchain-based rental agreements.
              </Text>
              
              <HStack spacing={4} pt={4}>
                <Button 
                  size="lg" 
                  colorScheme="white" 
                  variant="outline"
                  onClick={handleExploreProperties}
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  Explore Properties
                </Button>
                
                {!isConnected ? (
                  <Button 
                    size="lg" 
                    colorScheme="blue" 
                    bg="white"
                    color="blue.600"
                    onClick={handleConnectWallet}
                    _hover={{ bg: 'whiteAlpha.900' }}
                  >
                    Connect Wallet
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    colorScheme="blue" 
                    bg="white"
                    color="blue.600"
                    onClick={() => navigate(walletType === 'tenant' ? '/my-rentals' : '/my-properties')}
                    _hover={{ bg: 'whiteAlpha.900' }}
                  >
                    {walletType === 'tenant' ? 'My Rentals' : 'My Properties'}
                  </Button>
                )}
              </HStack>
            </VStack>
            
            <Box 
              maxW={{ base: '100%', md: '45%' }}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="2xl"
            >
              <Image 
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="Secure home rental" 
              />
            </Box>
          </Flex>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box py={20} px={4}>
        <Container maxW="1200px">
          <VStack spacing={16}>
            {/* Section Header */}
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl">
                Why Choose SecureStay?
              </Heading>
              <Text color="gray.600" maxW="800px">
                Our blockchain-based rental platform offers unparalleled security, transparency, and convenience.
              </Text>
            </VStack>
            
            {/* Features Grid */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
              {/* Feature 1 */}
              <VStack 
                align="flex-start" 
                p={6} 
                bg={useColorModeValue('white', 'gray.700')}
                borderRadius="lg"
                boxShadow="md"
                height="100%"
              >
                <Box 
                  p={3} 
                  bg="blue.50" 
                  borderRadius="md" 
                  color="blue.600"
                  mb={2}
                >
                  🔐
                </Box>
                <Heading size="md" mb={2}>
                  Smart Contract Escrow
                </Heading>
                <Text color="gray.600">
                  Your rental payment is held securely in a smart contract escrow until your stay is complete,
                  ensuring both parties are protected.
                </Text>
              </VStack>
              
              {/* Feature 2 */}
              <VStack 
                align="flex-start" 
                p={6} 
                bg={useColorModeValue('white', 'gray.700')}
                borderRadius="lg"
                boxShadow="md"
                height="100%"
              >
                <Box 
                  p={3} 
                  bg="purple.50" 
                  borderRadius="md" 
                  color="purple.600"
                  mb={2}
                >
                  🔑
                </Box>
                <Heading size="md" mb={2}>
                  Digital Access Keys
                </Heading>
                <Text color="gray.600">
                  Access your rental with cryptographically secure digital keys generated via smart
                  contracts. No physical key exchange needed.
                </Text>
              </VStack>
              
              {/* Feature 3 */}
              <VStack 
                align="flex-start" 
                p={6} 
                bg={useColorModeValue('white', 'gray.700')}
                borderRadius="lg"
                boxShadow="md"
                height="100%"
              >
                <Box 
                  p={3} 
                  bg="green.50" 
                  borderRadius="md" 
                  color="green.600"
                  mb={2}
                >
                  🤖
                </Box>
                <Heading size="md" mb={2}>
                  AI Monitoring
                </Heading>
                <Text color="gray.600">
                  Our AI monitors access patterns to detect unauthorized access attempts,
                  protecting both tenants and property owners.
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        bg={useColorModeValue('blue.50', 'blue.900')}
        py={16}
        px={4}
      >
        <Container maxW="1200px">
          <VStack spacing={8} textAlign="center">
            <Heading as="h2" size="xl">
              Ready to Experience the Future of Rentals?
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')} maxW="800px">
              Join our platform today to list your property or find your next secure stay.
            </Text>
            <HStack spacing={4}>
              {!isConnected ? (
                <Button 
                  size="lg" 
                  colorScheme="blue"
                  onClick={handleConnectWallet}
                >
                  Connect Wallet
                </Button>
              ) : walletType ? (
                <Button 
                  size="lg" 
                  colorScheme="blue"
                  onClick={() => navigate(walletType === 'tenant' ? '/properties' : '/my-properties')}
                >
                  {walletType === 'tenant' ? 'Find Properties' : 'Manage Properties'}
                </Button>
              ) : (
                <HStack spacing={4}>
                  <Button 
                    size="lg" 
                    colorScheme="green"
                    onClick={() => {
                      setWalletType('tenant');
                      navigate('/properties');
                    }}
                  >
                    I'm a Tenant
                  </Button>
                  <Button 
                    size="lg" 
                    colorScheme="purple"
                    onClick={() => {
                      setWalletType('owner');
                      navigate('/my-properties');
                    }}
                  >
                    I'm a Property Owner
                  </Button>
                </HStack>
              )}
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;