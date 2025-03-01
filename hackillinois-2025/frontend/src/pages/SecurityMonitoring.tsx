import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  FormControl,
  FormLabel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Divider,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { smartLockAPI } from '../services/api';

const SecurityMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const toast = useToast();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringInterval, setMonitoringInterval] = useState(15); // in minutes
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([]);
  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAlerts: 0,
    highSeverity: 0,
    mediumSeverity: 0,
    lowSeverity: 0,
  });
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Fetch data on component mount
  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }
    
    fetchSecurityData();
    fetchAccessLogs();
  }, [isConnected]);
  
  // Fetch security alerts
  const fetchSecurityData = () => {
    // Mock data for demonstration
    const mockAlerts = [
      {
        id: 'alert-1',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        property: 'Luxury Downtown Apartment',
        lock: 'Front Door',
        description: 'Multiple unsuccessful access attempts',
        severity: 'high',
        status: 'open',
      },
      {
        id: 'alert-2',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        property: 'Beach House',
        lock: 'Main Entrance',
        description: 'Access outside of normal hours',
        severity: 'medium',
        status: 'open',
      },
      {
        id: 'alert-3',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        property: 'Mountain Cabin',
        lock: 'Garage Door',
        description: 'Unusual access pattern detected',
        severity: 'low',
        status: 'resolved',
      },
    ];
    
    setSecurityAlerts(mockAlerts);
    
    // Set statistics
    setStats({
      totalAlerts: mockAlerts.length,
      highSeverity: mockAlerts.filter(alert => alert.severity === 'high').length,
      mediumSeverity: mockAlerts.filter(alert => alert.severity === 'medium').length,
      lowSeverity: mockAlerts.filter(alert => alert.severity === 'low').length,
    });
  };
  
  // Fetch access logs
  const fetchAccessLogs = () => {
    // Mock data for demonstration
    const mockLogs = [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        property: 'Luxury Downtown Apartment',
        lock: 'Front Door',
        user: 'Tenant (8xF3...j9Kl)',
        action: 'unlock',
        status: 'success',
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        property: 'Luxury Downtown Apartment',
        lock: 'Back Door',
        user: 'Tenant (8xF3...j9Kl)',
        action: 'unlock',
        status: 'success',
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 90000000).toISOString(), // ~1 day ago
        property: 'Beach House',
        lock: 'Main Entrance',
        user: 'Unknown (9dR2...k7Mn)',
        action: 'unlock',
        status: 'failed',
      },
      {
        id: 'log-4',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        property: 'Beach House',
        lock: 'Main Entrance',
        user: 'Owner (5tY6...h2Jk)',
        action: 'lock',
        status: 'success',
      },
      {
        id: 'log-5',
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        property: 'Mountain Cabin',
        lock: 'Front Door',
        user: 'Tenant (3zX9...m5Np)',
        action: 'unlock',
        status: 'success',
      },
    ];
    
    setAccessLogs(mockLogs);
  };
  
  // Toggle AI monitoring
  const toggleMonitoring = async () => {
    try {
      if (isMonitoring) {
        // In a real implementation, this would call the API to stop monitoring
        // await smartLockAPI.stopMonitoring();
        setIsMonitoring(false);
        toast({
          title: 'Monitoring stopped',
          description: 'AI security monitoring has been deactivated',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // In a real implementation, this would call the API to start monitoring
        // await smartLockAPI.startMonitoring(monitoringInterval * 60); // convert to seconds
        setIsMonitoring(true);
        toast({
          title: 'Monitoring started',
          description: `AI security monitoring activated with ${monitoringInterval}-minute interval`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to toggle monitoring:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle monitoring',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  // Mark alert as resolved
  const resolveAlert = (alertId: string) => {
    setSecurityAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'resolved' } : alert
      )
    );
    
    toast({
      title: 'Alert resolved',
      description: 'The security alert has been marked as resolved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };
  
  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'yellow';
      default:
        return 'gray';
    }
  };
  
  return (
    <Container maxW="1200px" py={8}>
      <Heading mb={2}>Security Monitoring</Heading>
      <Text color="gray.600" mb={6}>
        AI-powered monitoring for unauthorized access detection and security management
      </Text>
      
      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Stat
          px={5}
          py={5}
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          rounded="lg"
          boxShadow="sm"
        >
          <StatLabel>Total Alerts</StatLabel>
          <StatNumber fontSize="3xl">{stats.totalAlerts}</StatNumber>
          <StatHelpText>
            {securityAlerts.filter(a => a.status === 'open').length} active
          </StatHelpText>
        </Stat>
        
        <Stat
          px={5}
          py={5}
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          rounded="lg"
          boxShadow="sm"
        >
          <StatLabel>High Severity</StatLabel>
          <StatNumber fontSize="3xl" color="red.500">{stats.highSeverity}</StatNumber>
          <StatHelpText>
            <Badge colorScheme="red">Immediate attention</Badge>
          </StatHelpText>
        </Stat>
        
        <Stat
          px={5}
          py={5}
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          rounded="lg"
          boxShadow="sm"
        >
          <StatLabel>Medium Severity</StatLabel>
          <StatNumber fontSize="3xl" color="orange.500">{stats.mediumSeverity}</StatNumber>
          <StatHelpText>
            <Badge colorScheme="orange">Review needed</Badge>
          </StatHelpText>
        </Stat>
        
        <Stat
          px={5}
          py={5}
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          rounded="lg"
          boxShadow="sm"
        >
          <StatLabel>Low Severity</StatLabel>
          <StatNumber fontSize="3xl" color="yellow.500">{stats.lowSeverity}</StatNumber>
          <StatHelpText>
            <Badge colorScheme="yellow">Information</Badge>
          </StatHelpText>
        </Stat>
      </SimpleGrid>
      
      {/* AI Monitoring Controls */}
      <Box
        p={6}
        bg={bgColor}
        borderColor={borderColor}
        borderWidth="1px"
        rounded="lg"
        boxShadow="sm"
        mb={8}
      >
        <Heading size="md" mb={4}>AI Monitoring Controls</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box>
            <Text mb={4}>
              Our AI monitoring system constantly analyzes access patterns to detect unauthorized access
              attempts and suspicious activities.
            </Text>
            
            <Flex direction="column" gap={4}>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" htmlFor="monitoring-toggle">
                  AI Monitoring Status: 
                </FormLabel>
                <Badge
                  colorScheme={isMonitoring ? "green" : "gray"}
                  p={2}
                  ml={2}
                >
                  {isMonitoring ? "Active" : "Inactive"}
                </Badge>
                <Switch 
                  id="monitoring-toggle" 
                  colorScheme="green" 
                  isChecked={isMonitoring}
                  onChange={toggleMonitoring}
                  ml={4}
                  size="lg"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Monitoring Interval (minutes)</FormLabel>
                <HStack maxW="200px">
                  <Button
                    size="sm"
                    onClick={() => setMonitoringInterval(Math.max(5, monitoringInterval - 5))}
                    isDisabled={monitoringInterval <= 5}
                  >
                    -
                  </Button>
                  <Text fontWeight="bold" mx={2}>{monitoringInterval}</Text>
                  <Button
                    size="sm"
                    onClick={() => setMonitoringInterval(Math.min(60, monitoringInterval + 5))}
                    isDisabled={monitoringInterval >= 60}
                  >
                    +
                  </Button>
                </HStack>
              </FormControl>
            </Flex>
          </Box>
          
          <Box
            bg="blue.50"
            p={4}
            borderRadius="md"
            borderLeft="4px solid"
            borderColor="blue.500"
          >
            <Heading size="sm" color="blue.800" mb={2}>
              How AI Monitoring Works
            </Heading>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm">
                <Badge colorScheme="blue" mr={2}>1</Badge>
                System records all access events in blockchain for immutability
              </Text>
              <Text fontSize="sm">
                <Badge colorScheme="blue" mr={2}>2</Badge>
                AI constantly analyzes access patterns to establish baselines
              </Text>
              <Text fontSize="sm">
                <Badge colorScheme="blue" mr={2}>3</Badge>
                Unusual behaviors are flagged based on time, location, and frequency
              </Text>
              <Text fontSize="sm">
                <Badge colorScheme="blue" mr={2}>4</Badge>
                Alerts are triggered for suspicious activity with severity levels
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>
      
      {/* Security Alerts */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Security Alerts</Heading>
        
        {securityAlerts.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date & Time</Th>
                  <Th>Property</Th>
                  <Th>Lock</Th>
                  <Th>Description</Th>
                  <Th>Severity</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {securityAlerts.map(alert => (
                  <Tr key={alert.id}>
                    <Td>{formatDate(alert.timestamp)}</Td>
                    <Td>{alert.property}</Td>
                    <Td>{alert.lock}</Td>
                    <Td>{alert.description}</Td>
                    <Td>
                      <Badge colorScheme={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={alert.status === 'open' ? 'red' : 'green'}>
                        {alert.status}
                      </Badge>
                    </Td>
                    <Td>
                      {alert.status === 'open' ? (
                        <Button 
                          size="sm" 
                          colorScheme="green"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      ) : (
                        <Badge variant="outline" colorScheme="green">Resolved</Badge>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box 
            p={6} 
            textAlign="center" 
            bg={bgColor}
            borderRadius="md"
          >
            <Text>No security alerts found</Text>
          </Box>
        )}
      </Box>
      
      {/* Recent Access Logs */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Recent Access Logs</Heading>
        
        {accessLogs.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date & Time</Th>
                  <Th>Property</Th>
                  <Th>Lock</Th>
                  <Th>User</Th>
                  <Th>Action</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {accessLogs.map(log => (
                  <Tr key={log.id}>
                    <Td>{formatDate(log.timestamp)}</Td>
                    <Td>{log.property}</Td>
                    <Td>{log.lock}</Td>
                    <Td>{log.user}</Td>
                    <Td>{log.action}</Td>
                    <Td>
                      <Badge colorScheme={log.status === 'success' ? 'green' : 'red'}>
                        {log.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box 
            p={6} 
            textAlign="center" 
            bg={bgColor}
            borderRadius="md"
          >
            <Text>No access logs found</Text>
          </Box>
        )}
      </Box>
      
      <Divider my={8} />
      
      {/* Actions */}
      <Flex justify="space-between" wrap="wrap" gap={4}>
        <Button colorScheme="blue" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
        <Button colorScheme="blue" variant="outline" onClick={() => navigate('/digital-keys')}>
          Manage Digital Keys
        </Button>
      </Flex>
    </Container>
  );
};

export default SecurityMonitoring;