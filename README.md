# HackIllinois 2025 - Blockchain-Based Rental System

This project implements a blockchain-based rental system on the Solana blockchain with AI monitoring for unauthorized access. The system ensures secure access to rental properties via smart contracts and IoT-based smart locks.

## Project Structure

- **blockchain/**: Solana smart contracts
  - **solana-contract/**: Main rental contract implementation
    - **programs/solana-contract/src/lib.rs**: Solana program in Rust
    - **tests/**: Contract tests
    - **migrations/**: Deployment scripts

- **backend/**: Node.js API server
  - **src/services/**: Core services
    - **blockchainService.js**: Solana blockchain integration
    - **smartLockService.js**: Smart lock management
    - **aiMonitoringService.js**: AI monitoring for unauthorized access
  - **src/routes/**: API endpoints
    - **propertyRoutes.js**: Property listing and booking
    - **smartLockRoutes.js**: Smart lock management
  - **src/utils/**: Utility functions

- **frontend/**: React web application (to be implemented)

## Key Features

1. **Blockchain-Based Rental Agreements**
   - Secure escrow of rental funds
   - Automated access control
   - Transparent rental history

2. **Smart Lock Integration**
   - Digital access tokens generated via smart contracts
   - Temporary access for rental periods
   - Automated revocation when rental ends

3. **AI Monitoring for Unauthorized Access**
   - Real-time analysis of access attempts
   - Penalty system for unauthorized access by hosts
   - Anomaly detection and reporting

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Rust and Cargo
- Solana CLI tools
- Anchor framework for Solana

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/hackillinois-2025.git
   cd hackillinois-2025
   ```

2. Set up the backend
   ```
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Build the Solana smart contract
   ```
   cd blockchain/solana-contract
   anchor build
   anchor deploy
   # Update Program ID in backend/.env
   ```

4. Start the backend server
   ```
   cd backend
   npm run dev
   ```

### API Endpoints

The API documentation is available at `/api/docs` when the server is running.

#### Property Endpoints
- `GET /api/properties`: List all properties
- `POST /api/properties`: Create a new property
- `GET /api/properties/:id`: Get a specific property
- `POST /api/properties/:id/book`: Book a property
- `POST /api/properties/:id/access`: Generate access key
- `POST /api/properties/:id/complete`: Complete rental

#### Smart Lock Endpoints
- `GET /api/locks`: List all smart locks
- `POST /api/locks`: Register a new smart lock
- `GET /api/locks/:id`: Get a specific smart lock
- `POST /api/locks/:id/access`: Grant access
- `POST /api/locks/:id/validate`: Validate access
- `POST /api/locks/:id/unlock`: Unlock a door
- `POST /api/locks/:id/lock`: Lock a door
- `POST /api/locks/:id/revoke`: Revoke access
- `GET /api/locks/:id/history`: Get access history
- `GET /api/locks/:id/analyze`: Analyze access patterns
- `POST /api/locks/monitoring/start`: Start AI monitoring
- `POST /api/locks/monitoring/stop`: Stop AI monitoring
- `POST /api/locks/check-unauthorized`: Manually check for unauthorized access

## Architecture

### Smart Contract

The Solana smart contract manages:
- Property listings and details
- Rental agreements and escrow
- Access token generation and validation
- Penalties for unauthorized access

### Backend Services

1. **Blockchain Service**: Handles interaction with Solana blockchain
2. **Smart Lock Service**: Manages IoT-based smart locks
3. **AI Monitoring Service**: Monitors for unauthorized access attempts

### Security Features

- Escrow system secures funds until rental completion
- Cryptographic access tokens with expiration
- AI monitoring to prevent host intrusions
- Penalty system for contract violations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- HackIllinois 2025 organizers and mentors
- Solana Foundation for blockchain support
- All contributors to the project