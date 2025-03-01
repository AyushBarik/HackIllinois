# Solana Rental Contract

This is a Solana smart contract for managing property rentals, built with the Anchor framework.

## Project Structure

- `programs/solana-contract/src/`: Contains the Rust code for the Solana program
  - `lib.rs`: Main program file with instruction handlers
  - `state/`: Account structures
  - `errors.rs`: Custom error definitions
  - `utils.rs`: Utility functions

- `idl/`: Contains the Interface Description Language (IDL) file
  - `solana_contract.json`: Manually created IDL file for client integration

- `scripts/`: Contains helper scripts
  - `use-idl.js`: Example script showing how to use the IDL

## Features

- Create property contracts with rent amount, security deposit, and lease duration
- Tenant check-in and check-out functionality
- Retrieve tenant status

## Building and Testing

### Prerequisites

- Rust and Cargo
- Solana CLI tools
- Anchor framework

### Build

```bash
cargo build
```

### Test

```bash
cargo test
```

## Using the IDL

The IDL file is located at `idl/solana_contract.json`. You can use this file to interact with the deployed program using the Anchor client.

Example:

```javascript
const anchor = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

// Load the IDL
const idlPath = path.join(__dirname, '../idl/solana_contract.json');
const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));

// Configure the client
const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

// Address of the deployed program
const programId = new anchor.web3.PublicKey("9GmbEnoSYVse4AADADyKNfy4s3XWC3oKzzWb8HxazHjx");

// Create the program interface
const program = new anchor.Program(idl, programId, provider);

// Now you can interact with your program
async function createPropertyContract() {
  await program.methods.createPropertyContract(
    new anchor.BN(1000), // rent amount
    new anchor.BN(500),  // security deposit
    new anchor.BN(30 * 24 * 60 * 60) // lease duration in seconds (30 days)
  )
  .accounts({
    owner: provider.wallet.publicKey,
    // ... other accounts
  })
  .rpc();
}
```

## Troubleshooting

If you encounter the "IDL doesn't exist" error when using Anchor, you can use the manually created IDL file in the `idl/` directory.
