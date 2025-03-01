import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Heading,
  VStack,
  HStack,
  Badge,
  useToast,
  Progress,
  Flex,
  useColorModeValue,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { smartLockAPI } from '../services/api';

interface SmartLockCardProps {
  lock: {
    id: string;
    name: string;
    status: 'locked' | 'unlocked';
    battery: number;
    lastConnected: string;
    currentAccess: {
      accessToken: string;
      tenantPublicKey: string;
      grantedAt: string;
      validUntil: string;
    } | null;
  };
  accessToken?: string;
  onStatusChange?: () => void;
}

const SmartLockCard: React.FC<SmartLockCardProps> = ({ lock, accessToken, onStatusChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };
  
  // Calculate battery color based on level
  const getBatteryColor = (level: number) => {
    if (level > 70) return 'green';
    if (level > 30) return 'yellow';
    return 'red';
  };
  
  // Handle unlock door
  const handleUnlock = async () => {
    if (!accessToken) {
      toast({
        title: 'Error',
        description: 'No access token provided',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await smartLockAPI.unlockDoor(lock.id, accessToken);
      
      toast({
        title: 'Success',
        description: 'Door unlocked successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unlock door',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle lock door
  const handleLock = async () => {
    if (!accessToken) {
      toast({
        title: 'Error',
        description: 'No access token provided',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await smartLockAPI.lockDoor(lock.id, accessToken);
      
      toast({
        title: 'Success',
        description: 'Door locked successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to lock door',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden"
      bg={cardBg}
      borderColor={borderColor}
      p={5}
      boxShadow="md"
      w="100%"
      maxW="400px"
    >
      <VStack align="start" spacing={4}>
        <Flex w="100%" justify="space-between" align="center">
          <Heading size="md">{lock.name}</Heading>
          <Badge 
            colorScheme={lock.status === 'locked' ? 'red' : 'green'}
            fontSize="0.8em"
            p={1}
            borderRadius="md"
          >
            {lock.status === 'locked' ? '🔒 Locked' : '🔓 Unlocked'}
          </Badge>
        </Flex>
        
        <Text fontSize="sm" color="gray.500">
          ID: {lock.id}
        </Text>
        
        <Box w="100%">
          <Text fontSize="sm" mb={1}>Battery: {lock.battery}%</Text>
          <Progress 
            value={lock.battery} 
            colorScheme={getBatteryColor(lock.battery)}
            size="sm"
            borderRadius="md"
          />
        </Box>
        
        <Text fontSize="sm">
          Last Connected: {formatDate(lock.lastConnected)}
        </Text>
        
        {lock.currentAccess ? (
          <Box 
            bg="blue.50" 
            p={3} 
            borderRadius="md" 
            w="100%"
            borderLeft="4px solid"
            borderColor="blue.500"
          >
            <Text fontSize="sm" fontWeight="bold" color="blue.800">
              Active Access
            </Text>
            <Text fontSize="xs" color="gray.600">
              Tenant: {lock.currentAccess.tenantPublicKey.slice(0, 8)}...
            </Text>
            <Text fontSize="xs" color="gray.600">
              Valid until: {formatDate(lock.currentAccess.validUntil)}
            </Text>
          </Box>
        ) : (
          <Text fontSize="sm" color="gray.500">
            No active access
          </Text>
        )}
        
        <HStack w="100%" spacing={4}>
          {lock.status === 'locked' ? (
            <Button 
              colorScheme="green" 
              isLoading={isLoading}
              loadingText="Unlocking"
              onClick={handleUnlock}
              isDisabled={!accessToken}
              w="full"
            >
              Unlock Door
            </Button>
          ) : (
            <Button 
              colorScheme="red" 
              isLoading={isLoading}
              loadingText="Locking"
              onClick={handleLock}
              isDisabled={!accessToken}
              w="full"
            >
              Lock Door
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default SmartLockCard;