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
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Divider,
  Link,
  useColorModeValue,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

const TransactionHistory: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, walletType, publicKey } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    pendingAmount: 0,
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
    
    fetchTransactions();
  }, [isConnected, filter]);
  
  // Format SOL amount (from lamports)
  const formatSol = (lamports: number) => {
    return (lamports / 1000000000).toFixed(2);
  };
  
  // Calculate statistics
  const calculateStats = (txs: any[]) => {
    const total = txs.length;
    const totalAmount = txs.reduce((sum, tx) => sum + tx.amount, 0);
    const pendingAmount = txs
      .filter(tx => tx.status === 'pending')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    setStats({
      totalTransactions: total,
      totalAmount,
      pendingAmount,
    });
  };
  
  // Fetch transactions
  const fetchTransactions = () => {
    // Mock data for demonstration
    const mockTransactions = [
      {
        id: 'tx-1',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        type: 'payment',
        description: 'Rental payment for Luxury Downtown Apartment',
        amount: 500000000, // 0.5 SOL
        status: 'confirmed',
        confirmations: 32,
        sender: '8xF3...j9Kl',
        recipient: '5tY6...h2Jk',
        signature: 'bxCvd...9Km2',
        blockHeight: 123456789,
      },
      {
        id: 'tx-2',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        type: 'deposit',
        description: 'Security deposit for Beach House',
        amount: 1000000000, // 1 SOL
        status: 'confirmed',
        confirmations: 128,
        sender: '8xF3...j9Kl',
        recipient: '3zX9...m5Np',
        signature: 'mNb7...1Jsw',
        blockHeight: 123456500,
      },
      {
        id: 'tx-3',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        type: 'escrow',
        description: 'Mountain Cabin rental escrow',
        amount: 750000000, // 0.75 SOL
        status: 'pending',
        confirmations: 0,
        sender: '8xF3...j9Kl',
        recipient: '7cD4...p2Rx',
        signature: 'qWe5...3Pls',
        blockHeight: null,
      },
      {
        id: 'tx-4',
        timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        type: 'refund',
        description: 'Partial refund for early checkout',
        amount: 250000000, // 0.25 SOL
        status: 'confirmed',
        confirmations: 256,
        sender: '5tY6...h2Jk',
        recipient: '8xF3...j9Kl',
        signature: 'zXc8...6Gty',
        blockHeight: 123455000,
      },
      {
        id: 'tx-5',
        timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        type: 'payment',
        description: 'Additional cleaning fee',
        amount: 100000000, // 0.1 SOL
        status: 'confirmed',
        confirmations: 312,
        sender: '8xF3...j9Kl',
        recipient: '5tY6...h2Jk',
        signature: 'pQr7...2Jkl',
        blockHeight: 123454000,
      },
    ];
    
    // Apply filters
    let filteredTxs = mockTransactions;
    
    if (filter !== 'all') {
      filteredTxs = mockTransactions.filter(tx => tx.type === filter);
    }
    
    setTransactions(filteredTxs);
    calculateStats(filteredTxs);
  };
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };
  
  // Get transaction type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'blue';
      case 'deposit':
        return 'purple';
      case 'escrow':
        return 'orange';
      case 'refund':
        return 'green';
      default:
        return 'gray';
    }
  };
  
  // Handle filter change
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };
  
  return (
    <Container maxW="1200px" py={8}>
      <Heading mb={2}>Transaction History</Heading>
      <Text color="gray.600" mb={6}>
        Manage and track your blockchain-based rental payments and deposits
      </Text>
      
      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat
          px={4}
          py={5}
          bg={bgColor}
          borderColor={borderColor}
          borderWidth="1px"
          rounded="lg"
          boxShadow="sm"
        >
          <StatLabel>Total Transactions</StatLabel>
          <StatNumber fontSize="3xl">{stats.totalTransactions}</StatNumber>
          <StatHelpText>
            {walletType === 'tenant' ? 'Payments & deposits' : 'Received payments'}
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
          <StatLabel>Total Amount</StatLabel>
          <StatNumber fontSize="3xl" color="green.500">
            {formatSol(stats.totalAmount)} SOL
          </StatNumber>
          <StatHelpText>
            All time {walletType === 'tenant' ? 'spent' : 'received'}
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
          <StatLabel>Pending Amount</StatLabel>
          <StatNumber fontSize="3xl" color="yellow.500">
            {formatSol(stats.pendingAmount)} SOL
          </StatNumber>
          <StatHelpText>
            In escrow or pending confirmation
          </StatHelpText>
        </Stat>
      </SimpleGrid>
      
      {/* Filters */}
      <Flex
        mb={6}
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
        justify="space-between"
        gap={4}
      >
        <Box>
          <Heading size="md">Transaction Details</Heading>
        </Box>
        
        <HStack spacing={4}>
          <Select 
            value={filter} 
            onChange={handleFilterChange}
            w={{ base: 'full', md: '200px' }}
            bg={bgColor}
          >
            <option value="all">All Transactions</option>
            <option value="payment">Rental Payments</option>
            <option value="deposit">Security Deposits</option>
            <option value="escrow">Escrow Funds</option>
            <option value="refund">Refunds</option>
          </Select>
        </HStack>
      </Flex>
      
      {/* Transactions Table */}
      {transactions.length > 0 ? (
        <Box 
          overflowX="auto"
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date & Time</Th>
                <Th>Type</Th>
                <Th>Description</Th>
                <Th isNumeric>Amount (SOL)</Th>
                <Th>Status</Th>
                <Th>Transaction ID</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map(tx => (
                <Tr key={tx.id}>
                  <Td>{formatDate(tx.timestamp)}</Td>
                  <Td>
                    <Badge colorScheme={getTypeColor(tx.type)}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </Badge>
                  </Td>
                  <Td maxW="300px" isTruncated>{tx.description}</Td>
                  <Td isNumeric fontWeight="bold">
                    {formatSol(tx.amount)}
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(tx.status)}>
                      {tx.status}
                      {tx.status === 'confirmed' && ` (${tx.confirmations})`}
                    </Badge>
                  </Td>
                  <Td>
                    <Link 
                      href={`https://explorer.solana.com/tx/${tx.signature}`} 
                      isExternal
                      color="blue.500"
                      fontSize="sm"
                    >
                      {tx.signature.substring(0, 6)}...
                    </Link>
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
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Text>No transactions found for the selected filter</Text>
        </Box>
      )}
      
      {/* Transaction Details */}
      <Box
        mt={8}
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Heading size="md" mb={4}>Understanding Blockchain Transactions</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box>
            <VStack align="start" spacing={3}>
              <Heading size="sm" color="blue.600">Secure Escrow System</Heading>
              <Text fontSize="sm">
                Our platform uses smart contracts to create secure escrow accounts for rental 
                payments. Your funds remain in escrow until both parties confirm the rental 
                agreement has been fulfilled.
              </Text>
              
              <Heading size="sm" color="blue.600" mt={2}>Transaction Confirmations</Heading>
              <Text fontSize="sm">
                Blockchain transactions require confirmations from the network to be 
                considered final. More confirmations means higher security. We consider 
                transactions with 30+ confirmations to be fully confirmed.
              </Text>
            </VStack>
          </Box>
          
          <Box>
            <VStack align="start" spacing={3}>
              <Heading size="sm" color="blue.600">Transaction Types</Heading>
              <SimpleGrid columns={2} spacing={2} width="100%">
                <Box>
                  <Badge colorScheme="blue" mb={1}>Payment</Badge>
                  <Text fontSize="xs">Regular rental payments</Text>
                </Box>
                <Box>
                  <Badge colorScheme="purple" mb={1}>Deposit</Badge>
                  <Text fontSize="xs">Security deposits</Text>
                </Box>
                <Box>
                  <Badge colorScheme="orange" mb={1}>Escrow</Badge>
                  <Text fontSize="xs">Funds held in escrow</Text>
                </Box>
                <Box>
                  <Badge colorScheme="green" mb={1}>Refund</Badge>
                  <Text fontSize="xs">Returned funds</Text>
                </Box>
              </SimpleGrid>
              
              <Heading size="sm" color="blue.600" mt={2}>Transparency</Heading>
              <Text fontSize="sm">
                All transactions are recorded on the Solana blockchain, providing 
                complete transparency and immutability. You can verify any transaction 
                by clicking on its ID to view it in the Solana Explorer.
              </Text>
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>
      
      <Divider my={8} />
      
      {/* Actions */}
      <Flex justify="space-between" wrap="wrap" gap={4}>
        <Button colorScheme="blue" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
        <Button 
          colorScheme="blue" 
          variant="outline" 
          onClick={() => navigate(walletType === 'tenant' ? '/properties' : '/my-properties')}
        >
          {walletType === 'tenant' ? 'Browse Properties' : 'Manage Properties'}
        </Button>
      </Flex>
    </Container>
  );
};

export default TransactionHistory;