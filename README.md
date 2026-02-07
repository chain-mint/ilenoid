# 🌍 Ilenoid

<div align="center">

**Building a more accountable future on Stacks**

[![Built on Stacks](https://img.shields.io/badge/Built%20on-Stacks-5546FF?style=for-the-badge&logo=stacks)](https://www.stacks.co)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Stacks.js](https://img.shields.io/badge/Stacks.js-v6-5546FF?style=for-the-badge)](https://stacks.js.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[🌐 Live Demo](#-live-demo) • [📖 Documentation](#-documentation) • [🚀 Quick Start](#-getting-started) • [💡 Features](#-key-features) • [🤝 Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-project-overview)
- [Key Features](#-key-features)
- [Why Stacks?](#-why-stacks)
- [Tech Stack](#-tech-stack)
- [Live Demo](#-live-demo)
- [Getting Started](#-getting-started)
- [Smart Contracts](#-smart-contracts)
- [Architecture](#-architecture)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Project Overview

**Ilenoid** is a production-ready decentralized application (dApp) that revolutionizes charity transparency by leveraging blockchain technology on **Stacks**. Every donation, milestone, and fund release is recorded immutably on-chain, ensuring complete accountability and trust.

### The Problem We Solve

Traditional charity platforms lack transparency. Donors lose track of funds once they leave their bank account, leading to:
- ❌ Donor fatigue and distrust
- ❌ Lack of accountability
- ❌ No way to verify fund usage
- ❌ Limited donor engagement

### Our Solution

✅ **Immutable Tracking**: Every STX and SIP-010 token tracked on-chain from donation to expenditure  
✅ **Milestone Governance**: Funds locked in smart contracts, released only after donor approval  
✅ **Weighted Voting**: Donors vote based on contribution amount (vote weight = donation amount)  
✅ **Radical Transparency**: All operations recorded on-chain with full visibility  
✅ **Low Fees**: Built on Stacks for affordable transactions  
✅ **Bitcoin Security**: Leverages Bitcoin's security through Stacks blockchain

---

## ✨ Key Features

### 🔐 Core Functionality
- **Multi-Asset Donations**: Support for STX and SIP-010 fungible tokens
- **Milestone-Based Funding**: Projects broken into verifiable milestones
- **Weighted Voting System**: Donors vote on milestone releases based on contribution weight
- **NGO Verification**: Only verified NGOs can create projects
- **Real-Time Updates**: TanStack Query for efficient data fetching and caching
- **Emergency Controls**: Pausable contracts with owner controls

### 🚀 Stacks Ecosystem Integration
- **Stacks Connect**: Native wallet integration (Hiro, Xverse, and more)
- **Stacks Benefits**: Bitcoin security, Clarity language, low fees
- **Modern Web3 Stack**: @stacks/connect, @stacks/transactions, latest React patterns
- **Clarity 4**: Built with the latest Clarity language features

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Wallet Integration**: Stacks Connect for multi-wallet support
- **Network Support**: Testnet and Mainnet deployment ready
- **Error Handling**: Comprehensive error messages and recovery flows

### 📊 Transparency Features
- **On-Chain Records**: All transactions permanently recorded
- **Donation History**: Complete donation tracking per project
- **Milestone Tracking**: Real-time milestone status and voting progress
- **Project Analytics**: Funding progress, donor counts, and more

---

## 🏗️ Why Stacks?

We chose **Stacks** as our platform because:

1. **Bitcoin Security**: Inherits security and finality from Bitcoin
2. **Clarity Language**: Decidable, secure smart contracts by design
3. **Low Fees**: Affordable transactions for micro-donations
4. **Growing Ecosystem**: Active community and strong developer support
5. **sBTC Integration**: Native Bitcoin support through sBTC
6. **Post-Conditions**: Built-in transaction safety features

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.1](https://nextjs.org) (App Router, React Server Components)
- **Web3**: [@stacks/connect](https://github.com/stacks-network/stacks.js/tree/main/packages/connect) + [@stacks/transactions](https://github.com/stacks-network/stacks.js/tree/main/packages/transactions)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **State Management**: [Zustand v5](https://zustand-demo.pmnd.rs)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query)
- **UI Components**: Custom components with Headless UI
- **Notifications**: React Hot Toast

### Smart Contracts
- **Language**: [Clarity 4](https://docs.stacks.co/docs/clarity)
- **Framework**: [Clarinet](https://docs.hiro.so/clarinet)
- **Security**: Clarity's built-in security features (no reentrancy by design)
- **Testing**: Comprehensive test suite (37 tests) using @stacks/transactions
- **Deployment**: Stacks Testnet (✅), Mainnet (⏳)

### Infrastructure
- **Frontend Deployment**: [Netlify](https://ilenoid.netlify.app/)
- **Contract Deployment**: Stacks Testnet
- **RPC**: Stacks API endpoints (testnet.hiro.so)
- **Explorer**: [Stacks Explorer](https://explorer.stacks.co)

### Integrations
- **Stacks Connect**: Multi-wallet support (Hiro, Xverse, etc.)
- **@stacks/transactions**: Contract calls and read-only functions
- **Stacks Explorer**: Contract verification and exploration

---

## 🌐 Live Demo

- **Frontend**: [https://ilenoid.netlify.app/](https://ilenoid.netlify.app/) ✅ Live
- **Stacks Testnet**: ✅ Deployed
- **Stacks Mainnet**: ⏳ Pending final testing

### Contract Addresses

**Stacks Testnet:**
- **Deployer**: `ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q`
- **Ilenoid**: [`ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q.ilenoid`](https://explorer.stacks.co/txid/ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q.ilenoid?chain=testnet)
- **NGO Registry**: [`ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q.ngo-registry`](https://explorer.stacks.co/txid/ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q.ngo-registry?chain=testnet)
- [View on Stacks Explorer](https://explorer.stacks.co/address/ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q?chain=testnet)

- Address: ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q.ilenoid
- TX: a18b8d20c3ca5122803a3efd3292fbd9116f37a9d5c249b00c701e20e5e8ef17

**Stacks Mainnet:**
- Ilenoid: ⏳ Coming soon after testnet validation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Stacks Wallet** (Hiro Wallet, Xverse, etc.)
- **Stacks Testnet STX** (for testing) - Get from [Stacks Testnet Faucet](https://explorer.stacks.co/sandbox/faucet)
- **Git**
- **Clarinet** (for contract development) - Install from [Clarinet docs](https://docs.hiro.so/clarinet)

### Installation

1. **Clone the repository:**
```bash
git clone git@github.com:chain-mint/ilenoid.git
cd ilenoid
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stacks Network
NEXT_PUBLIC_STACKS_NETWORK=testnet  # testnet or mainnet
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so

# Contracts (Testnet)
NEXT_PUBLIC_ILENOID_ADDRESS=ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q.ilenoid
NEXT_PUBLIC_NGO_REGISTRY_ADDRESS=ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q.ngo-registry
```

4. **Run the development server:**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### Smart Contract Development

See the [contract README](./contract/README.md) for detailed instructions on:
- Building and testing contracts
- Deploying to Stacks networks
- Running tests with Clarinet
- Contract architecture and features

---

## 📜 Smart Contracts

### Key Contracts

1. **ilenoid.clar**: Main contract handling projects, donations, voting, and fund releases (753 lines)
2. **ngo-registry.clar**: Verified NGO management system

### Key Features

- ✅ Clarity 4 language features
- ✅ Pausable for emergency situations
- ✅ Owner-only functions for NGO management
- ✅ Milestone-based fund locking
- ✅ Weighted voting system (>50% quorum)
- ✅ Multi-asset support (STX + SIP-010 tokens)
- ✅ Built-in security (no reentrancy by design in Clarity)

### Security

- Comprehensive test coverage (37 tests)
- Clarity's built-in security features
- Access control mechanisms
- Emergency withdrawal capabilities
- Full on-chain transparency

See [contract documentation](./contract/README.md) for more details.

---

## 🔒 Security

### Security Features

- **Clarity Language**: Decidable, secure smart contracts by design
- **No Reentrancy**: Clarity prevents reentrancy attacks by design
- **Access Control**: Owner-only functions for critical operations
- **Pausable**: Emergency pause functionality
- **Input Validation**: Comprehensive checks on all inputs
- **On-Chain Transparency**: All operations are verifiable on-chain

### Audit Status

- ✅ Internal security review completed
- ✅ Comprehensive test suite (37 tests)
- ✅ Clarity's built-in security guarantees
- ⏳ External audit planned

### Reporting Security Issues

If you discover a security vulnerability, please email [security@yourdomain.com] instead of using the issue tracker.

---

## 📚 Documentation

- [Smart Contract Documentation](./contract/README.md)
- [Deployment Guide](./contract/DEPLOYMENT_GUIDE.md)
- [Implementation Phases](./contract/docs/IMPLEMENTATION_PHASES.md)
- [NGO Registration Flow](./docs/ngo-registration-flow.md)
- [Wallet Connection Setup](./docs/wallet-connection-setup.md)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow the existing code style
- Add comments for complex logic

---

## 🌟 Acknowledgments

- [Stacks](https://www.stacks.co) for the amazing Bitcoin L2 platform
- [Hiro](https://www.hiro.so) for excellent developer tools and documentation
- [Stacks.js](https://stacks.js.org) for Web3 integration
- [Farcaster](https://farcaster.xyz) for social infrastructure
- The entire Stacks and Web3 community for inspiration and support

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Live Frontend**: [https://ilenoid.netlify.app/](https://ilenoid.netlify.app/)
- **Testnet Contracts**: [Stacks Explorer](https://explorer.stacks.co/address/ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q?chain=testnet)
- **Smart Contract Docs**: [contract/README.md](./contract/README.md)
- **Stacks Documentation**: [docs.stacks.co](https://docs.stacks.co)

---

## 🙏 Support

If you find this project useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing code
- 📢 Sharing with others

---

<div align="center">


[Stacks](https://www.stacks.co) • [Stacks.js](https://stacks.js.org) • [Next.js](https://nextjs.org) • [Farcaster](https://farcaster.xyz)

</div>
