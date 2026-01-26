# Ilenoid Smart Contracts

Smart contracts for the Ilenoid transparent charity tracker on Stacks blockchain.

## Project Structure

```
contractz/
├── contracts/           # Clarity smart contracts
│   ├── ilenoid.clar     # Main contract (to be implemented)
│   └── ngo-registry.clar # NGO registry contract (to be implemented)
├── tests/               # TypeScript test files
├── settings/            # Network configuration
│   ├── Devnet.toml
│   ├── Testnet.toml
│   └── Mainnet.toml
├── Clarinet.toml        # Project manifest
├── package.json         # Dependencies
├── tsconfig.json       # TypeScript config
└── vitest.config.ts     # Vitest config
```

## Configuration

- **Clarity Version**: 4
- **Epoch**: "latest"
- **Framework**: Clarinet 3.13.0+

## Dependencies

- `@stacks/clarinet-sdk: ^3.10.0`
- `@stacks/transactions: ^7.3.0`
- `vitest-environment-clarinet: ^3.0.2`
- `vitest: ^4.0.7`

## Getting Started

### Prerequisites

- [Clarinet](https://docs.stacks.co/build/clarinet) installed
- Node.js 18+ and npm

### Installation

```bash
cd contractz
npm install
```

### Development

```bash
# Check contracts
clarinet check

# Format contracts
clarinet fmt

# Run tests
npm test

# Run tests with coverage
npm run test:report

# Start devnet
clarinet devnet start
```

## Migration Status

This project is migrating from Base L2 (Solidity) to Stacks (Clarity).

### Documentation

- **[IMPLEMENTATION_PHASES.md](./IMPLEMENTATION_PHASES.md)**: Detailed phased implementation plan
- **[MIGRATION_QUICK_REFERENCE.md](./MIGRATION_QUICK_REFERENCE.md)**: Quick reference for Solidity → Clarity migration

### Current Status

- ✅ Project structure created
- ✅ Configuration updated (Clarity 4, epoch "latest")
- ✅ Dependencies updated to latest versions
- ⏳ Contracts implementation (in progress)
- ⏳ Tests (pending)

## Implementation Phases

See [IMPLEMENTATION_PHASES.md](./IMPLEMENTATION_PHASES.md) for the complete 15-phase implementation plan:

1. **Phase 1**: Project Setup & Configuration
2. **Phase 2**: Core Data Structures & Constants
3. **Phase 3**: Access Control & Pause Mechanism
4. **Phase 4**: NGO Management
5. **Phase 5**: Project Creation
6. **Phase 6**: STX Donations
7. **Phase 7**: SIP-010 Token Donations
8. **Phase 8**: Milestone Voting
9. **Phase 9**: Fund Release
10. **Phase 10**: Emergency Controls
11. **Phase 11**: Read-Only Functions
12. **Phase 12**: Testing Infrastructure
13. **Phase 13**: Contract Validation & Optimization
14. **Phase 14**: Documentation
15. **Phase 15**: Deployment Preparation

## Key Features

- ✅ NGO registration and verification
- ✅ Project creation with milestones
- ✅ STX and SIP-010 token donations
- ✅ Weighted donor voting
- ✅ Milestone-based fund release
- ✅ Emergency controls (pause/unpause, withdrawal)

## Source Contract

The original Solidity implementation is located in `/contract` directory:
- `contract/src/CharityTracker.sol` - Main contract
- `contract/src/types/DataStructures.sol` - Data structures
- `contract/src/libraries/Errors.sol` - Error definitions

## Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language Reference](https://docs.stacks.co/reference/clarity)
- [Clarinet Documentation](https://docs.stacks.co/build/clarinet)
- [SIP-010 Token Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)

