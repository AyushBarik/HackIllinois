import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  useColorModeValue,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { smartLockAPI, propertyAPI } from '../services/api';
import SmartLockCard from '../components/SmartLockCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, walletType } = useWallet();
  const [activeProperties, setActiveProperties] = useState(0);
  const [activeRentals, setActiveRentals] = useState(0);
  const [accessKeys, setAccessKeys] = useState(0);
  const [securityAlerts, setSecurityAlerts] = useState(0);
  const [locks, setLocks] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Fetch dashboard data
  useEffect(() => {
    if (!isConnected) {
      navigate('/');
      return;
    }
    
    // Fetch mock data for demonstration
    fetchDashboardData();
    fetchSmartLocks();
    fetchRecentActivity();
  }, [isConnected, walletType]);
  
  // Fetch statistics
  const fetchDashboardData = () => {
    if (walletType === 'owner') {
      setActiveProperties(3);
      setActiveRentals(2);
      setAccessKeys(4);
      setSecurityAlerts(1);
    } else {
      setActiveProperties(0);
      setActiveRentals(1);
      setAccessKeys(2);
      setSecurityAlerts(0);
    }
  };
  
  // Fetch smart locks
  const fetchSmartLocks = () => {
    // Mock data for demonstration
    const mockLocks = [
      {
        id: 'lock-1',
        name: 'Front Door',
        status: 'locked',
        battery: 87,
        lastConnected: new Date().toISOString(),
        currentAccess: {
          accessToken: 'abc123',
          tenantPublicKey: '7x9s8dfu21',
          grantedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          validUntil: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
        },
      },
      {
        id: 'lock-2',
        name: 'Back Door',
        status: 'locked',
        battery: 56,
        lastConnected: new Date().toISOString(),
        currentAccess: null,
      },
    ];
    
    setLocks(mockLocks);
  };
  
  // Fetch recent activity
  const fetchRecentActivity = () => {
    // Mock data for demonstration
    const mockActivity = [
      {
        id: 'act-1',
        type: 'access',
        description: 'Front door accessed with digital key',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        property: 'Luxury Downtown Apartment',
      },
      {
        id: 'act-2',
        type: 'transaction',
        description: 'Rental payment completed',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        property: 'Luxury Downtown Apartment',
        amount: '0.5 SOL',
      },
      {
        id: 'act-3',
        type: 'alert',
        description: 'Unusual access pattern detected',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        property: 'Luxury Downtown Apartment',
        severity: 'medium',
      },
    ];
    
    setRecentActivity(mockActivity);
  };
  
  // Toggle AI monitoring
  const toggleMonitoring = async () => {
    try {
      if (isMonitoring) {
        // In a real implementation, this would call the API to stop monitoring
        // await smartLockAPI.stopMonitoring();
        setIsMonitoring(false);
      } else {
        // In a real implementation, this would call the API to start monitoring
        // await smartLockAPI.startMonitoring();
        setIsMonitoring(true);
      }
    } catch (error) {
      console.error('Failed to toggle monitoring:', error);
    }
  };
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };
  
  // Get activity icon and color
  const getActivityDetails = (activityType: string) => {
    switch (activityType) {
      case 'access':
        return { icon: '🔑', color: 'blue.500' };
      case 'transaction':
        return { icon: '💰', color: 'green.500' };
      case 'alert':
        return { icon: '⚠️', color: 'orange.500' };
      default:
        return { icon: '📋', color: 'gray.500' };
    }
  };
  
  return (
    <Container maxW="1200px" py={8}>
      <Heading mb={6}>Dashboard</Heading>
      
      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Stat
          px={4}
          py={5}
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          rounded="lg"
          boxShadow="sm"
        >
          <StatLabel>Active {walletType === 'owner' ? 'Properties' : 'Rentals'}</StatLabel>
          <StatNumber fontSize="3xl">{walletType === 'owner' ? activeProperties : activeRentals}</StatNumber>
          <StatHelpText>
            {walletType === 'owner' ? 'Properties you own' : 'Properties you are renting'}
          </StatHelpText>
        </Stat>
        
        <Stat
          px={4}
          py={5}
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          rounded="lg"
          boxShadow="sm"
        >
          <StatLabel>Digital Keys</StatLabel>
          <StatNumber fontSize="3xl">{accessKeys}</StatNumber>
          <StatHelpText>Active access credentials</StatHelpText>
        </Stat>
        
        <Stat
          px={4}
          py={5}
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          rounded="lg"
          boxShadow="sm"
        >
          <StatLabel>Security Alerts</StatLabel>
          <StatNumber fontSize="3xl">{securityAlerts}</StatNumber>
          <StatHelpText>
            <Badge colorScheme={securityAlerts > 0 ? "orange" : "green"}>
              {securityAlerts > 0 ? "Attention needed" : "All clear"}
            </Badge>
          </StatHelpText>
        </Stat>
        
        <Stat
          px={4}
          py={5}
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          rounded="lg"
          boxShadow="sm"
        >
          <StatLabel>AI Monitoring</StatLabel>
          <StatNumber fontSize="xl">
            <Badge colorScheme={isMonitoring ? "green" : "gray"} p={2} borderRadius="md">
              {isMonitoring ? "Active" : "Inactive"}
            </Badge>
          </StatNumber>
          <StatHelpText>
            <Button 
              size="xs" 
              colorScheme={isMonitoring ? "red" : "green"}
              onClick={toggleMonitoring}
              mt={2}
            >
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </Button>
          </StatHelpText>
        </Stat>
      </SimpleGrid>
      
      {/* Main Dashboard Content */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Smart Locks</Tab>
          <Tab>Recent Activity</Tab>
          {walletType === 'owner' && <Tab>Property Management</Tab>}
        </TabList>
        
        <TabPanels>
          {/* Smart Locks Panel */}
          <TabPanel>
            <Box mb={6}>
              <Heading size="md" mb={4}>Your Smart Locks</Heading>
              <Text color="gray.600" mb={4}>
                Manage and monitor your smart locks. Control access and check status in real-time.
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {locks.map(lock => (
                  <SmartLockCard
                    key={lock.id}
                    lock={lock}
                    accessToken={lock.currentAccess?.accessToken}
                    onStatusChange={fetchSmartLocks}
                  />
                ))}
              </SimpleGrid>
            </Box>
          </TabPanel>
          
          {/* Recent Activity Panel */}
          <TabPanel>
            <Box mb={6}>
              <Heading size="md" mb={4}>Recent Activity</Heading>
              <Text color="gray.600" mb={4}>
                Track all property-related activity including access events, transactions, and security alerts.
              </Text>
              <Box>
                {recentActivity.map((activity, index) => {
                  const { icon, color } = getActivityDetails(activity.type);
                  return (
                    <Box key={activity.id}>
                      <Flex 
                        p={4} 
                        alignItems="center" 
                        borderRadius="md"
                        _hover={{ bg: hoverBgColor }}
                      >
                        <Box 
                          p={3} 
                          borderRadius="full" 
                          bg={`${color}30`} 
                          color={color}
                          mr={4}
                          fontSize="xl"
                        >
                          {icon}
                        </Box>
                        <Box flex="1">
                          <Text fontWeight="bold">{activity.description}</Text>
                          <Flex justifyContent="space-between" alignItems="center">
                            <Text fontSize="sm" color="gray.500">
                              {activity.property}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {formatDate(activity.timestamp)}
                            </Text>
                          </Flex>
                          {activity.amount && (
                            <Badge colorScheme="green" mt={1}>
                              {activity.amount}
                            </Badge>
                          )}
                          {activity.severity && (
                            <Badge 
                              colorScheme={
                                activity.severity === 'high' ? 'red' : 
                                activity.severity === 'medium' ? 'orange' : 'yellow'
                              }
                              mt={1}
                            >
                              {activity.severity} severity
                            </Badge>
                          )}
                        </Box>
                      </Flex>
                      {index < recentActivity.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </Box>
              <Button 
                colorScheme="blue" 
                variant="outline" 
                mt={4}
                onClick={() => navigate('/transactions')}
              >
                View All Transactions
              </Button>
            </Box>
          </TabPanel>
          
          {/* Property Management Panel (Owner only) */}
          {walletType === 'owner' && (
            <TabPanel>
              <Box mb={6}>
                <Heading size="md" mb={4}>Property Management</Heading>
                <Text color="gray.600" mb={4}>
                  Manage your rental properties, track occupancy, and monitor revenue.
                </Text>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box
                    p={6}
                    bg={bgColor}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                  >
                    <Heading size="sm" mb={3}>Occupancy Rate</Heading>
                    <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                      67%
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      2 of 3 properties currently rented
                    </Text>
                  </Box>
                  
                  <Box
                    p={6}
                    bg={bgColor}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                  >
                    <Heading size="sm" mb={3}>Revenue (Last 30 Days)</Heading>
                    <Text fontSize="3xl" fontWeight="bold" color="green.500">
                      1.75 SOL
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      +0.5 SOL from previous period
                    </Text>
                  </Box>
                </SimpleGrid>
                
                <Button 
                  colorScheme="blue" 
                  mt={6}
                  onClick={() => navigate('/my-properties')}
                >
                  Manage Properties
                </Button>
              </Box>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Dashboard;