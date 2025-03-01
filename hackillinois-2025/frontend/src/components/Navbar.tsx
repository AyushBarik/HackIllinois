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
} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { publicKey, isConnected, connect, disconnect, walletType, setWalletType } = useWallet();
  
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
        {/* Logo */}
        <HStack spacing={3} onClick={() => navigate('/')} cursor="pointer">
          <Heading size="md">🏠 SecureStay</Heading>
          <Text fontSize="sm" color="blue.200">Blockchain Rentals</Text>
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
            <Link to="/digital-keys">
              <Text _hover={{ color: 'blue.200' }}>Digital Keys</Text>
            </Link>
          )}
        </HStack>
        
        {/* Wallet Connection */}
        <HStack spacing={4}>
          {isConnected ? (
            <>
              <Menu>
                <MenuButton as={Button} colorScheme="blue" variant="ghost">
                  {truncatePublicKey(publicKey || '')}
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