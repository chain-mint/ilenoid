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

✅ **Immutable Tracking**: Every dollar (ETH/USDC) tracked on-chain from donation to expenditure  
✅ **Milestone Governance**: Funds locked in smart contracts, released only after donor approval  
✅ **Weighted Voting**: Donors vote based on contribution amount (1 token = 1 vote)  
✅ **Radical Transparency**: All receipts and impact reports hashed on-chain via IPFS  
✅ **Low Fees**: Built on Base L2 for affordable transactions  
✅ **Social Discovery**: Farcaster Mini App integration for viral growth

---

## ✨ Key Features

### 🔐 Core Functionality
- **Multi-Token Donations**: Support for ETH and ERC20 tokens (USDC, etc.)
- **Milestone-Based Funding**: Projects broken into verifiable milestones
- **Weighted Voting System**: Donors vote on milestone releases based on contribution weight
- **NGO Verification**: Only verified NGOs can create projects
- **Real-Time Updates**: React Query for efficient data fetching and caching
- **Emergency Controls**: Pausable contracts with owner controls

### 🚀 Stacks Ecosystem Integration
- **Farcaster Mini App**: Native integration for social discovery and viral growth
- **Stacks Benefits**: Bitcoin security, Clarity language, low fees
- **Modern Web3 Stack**: Stacks.js, Stacks Connect, latest React patterns

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Wallet Integration**: MetaMask, WalletConnect, and more
- **Network Switching**: Automatic Base network detection and switching
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
- **Web3**: [Stacks.js](https://stacks.js.org) + [Stacks Connect](https://www.hiro.so/wallet/connect-web)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **State Management**: [Zustand v5](https://zustand-demo.pmnd.rs)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query)
- **UI Components**: Custom components with Headless UI
- **Notifications**: React Hot Toast

### Smart Contracts
- **Language**: [Clarity](https://docs.stacks.co/docs/clarity)
- **Framework**: [Clarinet](https://docs.hiro.so/clarinet)
- **Security**: Clarity's built-in security features (no reentrancy by design)
- **Testing**: Comprehensive Clarinet test suite

### Infrastructure
- **Deployment**: Vercel (Frontend), Stacks Mainnet (Contracts)
- **RPC**: Stacks API endpoints
- **IPFS**: For milestone proofs and receipts (future)

### Integrations
- **Farcaster Mini App SDK**: Social discovery and engagement
- **Stacks Connect**: Multi-wallet support (Hiro, Xverse, etc.)
- **Stacks Explorer**: Contract verification and exploration

---

## 🌐 Live Demo

- **Frontend**: [Coming Soon] 🚀
- **Stacks Testnet**: [Coming Soon]
- **Stacks Mainnet**: [Coming Soon]

### Contract Addresses

**Stacks Testnet:**
- Ilenoid: [Coming Soon]
- NGO Registry: [Coming Soon]

**Stacks Mainnet:**
- Ilenoid: [Coming Soon]
  - [View on Stacks Explorer](https://explorer.stacks.co/)
  - [View on Hiro Explorer](https://explorer.hiro.so/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Web3 Wallet** (MetaMask, Coinbase Wallet, etc.)
- **Stacks Testnet STX** (for testing) - Get from [Stacks Testnet Faucet](https://explorer.stacks.co/sandbox/faucet)
- **Git**

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
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
# Or use a dedicated provider

# Contracts
NEXT_PUBLIC_ILENOID_ADDRESS=ST000000000000000000000000000000000000000

# WalletConnect (Optional but recommended)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
# Get from: https://cloud.reown.com/

# USDC Token (Optional)
NEXT_PUBLIC_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
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
- Deploying to Base networks
- Running tests
- Gas optimization

---

## 📜 Smart Contracts

### Key Contracts

1. **Ilenoid.clar**: Main contract handling projects, donations, voting, and fund releases
2. **NGO Registry**: Verified NGO management system

### Key Features

- ✅ Reentrancy protection (OpenZeppelin ReentrancyGuard)
- ✅ Pausable for emergency situations
- ✅ Owner-only functions for NGO management
- ✅ Milestone-based fund locking
- ✅ Weighted voting system (>50% quorum)
- ✅ Multi-token support (ETH + ERC20)

### Security

- Comprehensive test coverage
- OpenZeppelin battle-tested contracts
- CEI (Checks-Effects-Interactions) pattern
- Custom errors for gas efficiency
- Access control mechanisms

See [contract documentation](./contract/README.md) for more details.

---

## 🏛️ Architecture

### Frontend Architecture

```
app/
├── page.tsx              # Home page with project listing
├── project/
│   ├── [id]/            # Project detail page
│   └── create/          # Create project page
├── ngo/
│   ├── dashboard/       # NGO dashboard
│   └── register/        # NGO registration
├── admin/
│   └── ngos/            # Admin panel for NGO management
└── donate/
    └── [id]/            # Donation page

components/
├── project/             # Project-related components
├── donation/            # Donation components
├── web3/                # Web3 wallet components
└── ui/                  # Reusable UI components

hooks/
├── useProject.ts        # Project data fetching
├── useDonation.ts       # Donation logic
├── useVoting.ts         # Voting logic
└── useNGO.ts            # NGO verification
```

### Smart Contract Architecture

```
contracts/
├── ilenoid.clar   # Main contract
├── interfaces/          # Contract interfaces
├── libraries/           # Shared libraries
└── types/              # Data structures
```

---

## 🔒 Security

### Security Features

- **Reentrancy Protection**: OpenZeppelin ReentrancyGuard
- **Access Control**: Owner-only functions for critical operations
- **Pausable**: Emergency pause functionality
- **Input Validation**: Comprehensive checks on all inputs
- **Gas Optimization**: Custom errors, packed structs
- **Upgrade Path**: Designed for future upgradeability

### Audit Status

- ✅ Internal security review completed
- ✅ OpenZeppelin contracts used (audited)
- ⏳ External audit planned

### Reporting Security Issues

If you discover a security vulnerability, please email [security@yourdomain.com] instead of using the issue tracker.

---

## 📚 Documentation

- [Smart Contract Documentation](./contract/README.md)
- [Base Builder Ranking Strategy](./docs/BASE_BUILDER_RANKING_STRATEGY.md)
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

## 📊 Project Status

### ✅ Completed
- Smart contract development and testing
- Frontend application (Next.js)
- Wallet integration (Wagmi v3)
- NGO registration system
- Donation system (ETH + ERC20)
- Voting system
- Milestone management
- Admin panel
- Farcaster Mini App integration

### 🚧 In Progress
- Mainnet deployment
- Production frontend deployment
- IPFS integration for milestone proofs
- Analytics dashboard

### 📋 Planned
- Mobile app (React Native)
- Additional token support
- Governance token
- Staking mechanisms
- Multi-language support

---

## 📈 Metrics & Impact

### On-Chain Metrics
- **Total Projects**: [Update with live data]
- **Total Donations**: [Update with live data]
- **Active NGOs**: [Update with live data]
- **Total Votes Cast**: [Update with live data]

### GitHub Metrics
- **Stars**: [Update]
- **Forks**: [Update]
- **Contributors**: [Update]

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

- **Website**: [https://tranct.netlify.app](https://tranct.netlify.app)
- **Documentation**: [Update with your docs URL]
- **Twitter/X**: [@YourHandle](https://twitter.com/YourHandle)
- **Discord**: [Your Discord](https://discord.gg/your-server)
- **GitHub**: [Your Repo](https://github.com/yourusername/ilenoid)

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

**Built with ❤️ on Stacks**

[Stacks](https://www.stacks.co) • [Stacks.js](https://stacks.js.org) • [Next.js](https://nextjs.org) • [Farcaster](https://farcaster.xyz)

</div>
