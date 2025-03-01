import React from 'react';
import { 
  Box, 
  Flex, 
  Button, 
  Heading, 
  Text, 
  HStack, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Switch,
  FormControl,
  FormLabel,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useMode } from '../context/ModeContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { publicKey, isConnected, connect, disconnect, walletType, setWalletType, balance } = useWallet();
  const { isDemoMode, toggleMode } = useMode();
  
  // Handle wallet connection
  const handleConnect = async () => {
    if (!isConnected) {
      try {
        await connect();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };
  
  // Truncate public key for display
  const truncatePublicKey = (key: string) => {
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };
  
  return (
    <Box as="nav" bg="blue.800" p={4} color="white" boxShadow="md">
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {/* Logo and Mode Toggle */}
        <HStack spacing={3}>
          <HStack spacing={3} onClick={() => navigate('/')} cursor="pointer">
            <Heading size="md">🏠 SecureStay</Heading>
            <Text fontSize="sm" color="blue.200">Blockchain Rentals</Text>
          </HStack>
          
          <Tooltip label={isDemoMode ? "Using mock data and simulated blockchain" : "Using real Solana blockchain"}>
            <FormControl display="flex" alignItems="center" width="auto" ml={4}>
              <FormLabel htmlFor="demo-mode" mb="0" fontSize="xs">
                {isDemoMode ? (
                  <Badge colorScheme="green">Demo Mode</Badge>
                ) : (
                  <Badge colorScheme="purple">Real Mode</Badge>
                )}
              </FormLabel>
              <Switch 
                id="demo-mode" 
                size="sm" 
                colorScheme="green" 
                isChecked={isDemoMode}
                onChange={toggleMode} 
              />
            </FormControl>
          </Tooltip>
        </HStack>
        
        {/* Navigation Links */}
        <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
          <Link to="/properties">
            <Text _hover={{ color: 'blue.200' }}>Properties</Text>
          </Link>
          
          {isConnected && walletType === 'owner' && (
            <Link to="/my-properties">
              <Text _hover={{ color: 'blue.200' }}>My Properties</Text>
            </Link>
          )}
          
          {isConnected && walletType === 'tenant' && (
            <Link to="/my-rentals">
              <Text _hover={{ color: 'blue.200' }}>My Rentals</Text>
            </Link>
          )}
          
          {isConnected && (
            <>
              <Link to="/digital-keys">
                <Text _hover={{ color: 'blue.200' }}>Digital Keys</Text>
              </Link>
              <Link to="/security">
                <Text _hover={{ color: 'blue.200' }}>Security</Text>
              </Link>
              <Link to="/transactions">
                <Text _hover={{ color: 'blue.200' }}>Transactions</Text>
              </Link>
            </>
          )}
        </HStack>
        
        {/* Wallet Connection */}
        <HStack spacing={4}>
          {isConnected ? (
            <>
              <Menu>
                <MenuButton as={Button} colorScheme="blue" variant="ghost">
                  <HStack>
                    <Text>{truncatePublicKey(publicKey || '')}</Text>
                    {balance !== null && (
                      <Badge colorScheme="green" variant="solid">
                        {balance.toFixed(2)} SOL
                      </Badge>
                    )}
                  </HStack>
                </MenuButton>
                <MenuList color="black">
                  <MenuItem onClick={() => setWalletType('owner')}>
                    {walletType === 'owner' ? '✓ Property Owner' : 'Switch to Owner'}
                  </MenuItem>
                  <MenuItem onClick={() => setWalletType('tenant')}>
                    {walletType === 'tenant' ? '✓ Tenant' : 'Switch to Tenant'}
                  </MenuItem>
                  <MenuItem onClick={disconnect}>Disconnect Wallet</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Button onClick={handleConnect} colorScheme="blue">
              Connect Wallet
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;