# Ilenoid: Base to Stacks Migration - Implementation Phases

## Overview
This document outlines the phased migration of the Ilenoid charity tracker from Base L2 (Solidity) to Stacks (Clarity) using the latest Clarity 4 and epoch "latest" configuration.

## Migration Context

### Source: `/contract` (Base/Solidity)
- **Language**: Solidity ^0.8.24
- **Framework**: Foundry
- **Tokens**: ETH + ERC20 (USDC)
- **Features**: NGO registry, project creation, donations, voting, fund release, emergency controls

### Target: `/contractz` (Stacks/Clarity)
- **Language**: Clarity 4
- **Framework**: Clarinet 3.13.0+
- **Tokens**: STX + SIP-010 tokens
- **Epoch**: "latest"
- **Packages**: `@stacks/clarinet-sdk ^3.10.0`, `vitest-environment-clarinet ^3.0.2`, `vitest ^4.0.7`

---

## Phase 1: Project Setup & Configuration

### 1.1 Update Clarinet Configuration
- [ ] Update `Clarinet.toml` with project metadata (name: "ilenoid")
- [ ] Configure contracts with `clarity_version = 4` and `epoch = "latest"`
- [ ] Register main contract: `ilenoid.clar`
- [ ] Register NGO registry contract: `ngo-registry.clar` (if separate)

### 1.2 Update Dependencies
- [ ] Update `package.json` dependencies to latest:
  - `@stacks/clarinet-sdk: ^3.10.0`
  - `@stacks/transactions: ^7.3.0`
  - `vitest-environment-clarinet: ^3.0.2`
  - `vitest: ^4.0.7`
- [ ] Verify `tsconfig.json` includes `@stacks/clarinet-sdk/vitest-helpers/src`
- [ ] Verify `vitest.config.ts` uses `@stacks/clarinet-sdk/vitest`

### 1.3 Network Settings
- [ ] Generate valid 24-word BIP39 mnemonics for `settings/Devnet.toml`
- [ ] Generate valid 24-word BIP39 mnemonics for `settings/Testnet.toml`
- [ ] Generate valid 24-word BIP39 mnemonics for `settings/Mainnet.toml`
- [ ] Configure account balances for testing

---

## Phase 2: Core Data Structures & Constants

### 2.1 Error Constants
- [ ] Define error constants using `define-constant`:
  - `ERR_INVALID_NGO`
  - `ERR_NGO_ALREADY_VERIFIED`
  - `ERR_NGO_NOT_VERIFIED`
  - `ERR_NOT_VERIFIED_NGO`
  - `ERR_INVALID_GOAL`
  - `ERR_INVALID_MILESTONE_ARRAYS`
  - `ERR_INVALID_MILESTONE_AMOUNT`
  - `ERR_MILESTONE_SUM_EXCEEDS_GOAL`
  - `ERR_PROJECT_NOT_FOUND`
  - `ERR_PROJECT_NOT_ACTIVE`
  - `ERR_PROJECT_COMPLETED`
  - `ERR_INVALID_DONATION_AMOUNT`
  - `ERR_INVALID_DONATION_TOKEN`
  - `ERR_INSUFFICIENT_ALLOWANCE`
  - `ERR_INSUFFICIENT_BALANCE`
  - `ERR_NO_CONTRIBUTION`
  - `ERR_ALREADY_VOTED`
  - `ERR_MILESTONE_ALREADY_APPROVED`
  - `ERR_NO_CURRENT_MILESTONE`
  - `ERR_NOT_PROJECT_NGO`
  - `ERR_MILESTONE_ALREADY_RELEASED`
  - `ERR_INSUFFICIENT_PROJECT_BALANCE`
  - `ERR_QUORUM_NOT_MET`
  - `ERR_CONTRACT_PAUSED`

### 2.2 Owner Constant
- [ ] Define `CONTRACT_OWNER` using `tx-sender` pattern

### 2.3 Data Variables
- [ ] Define `project-counter` (uint) initialized to `u0`
- [ ] Define `contract-paused` (bool) initialized to `false`

### 2.4 Data Maps
- [ ] Define `verified-ngos` map: `principal -> bool`
- [ ] Define `projects` map: `uint -> {id: uint, ngo: principal, donation-token: (optional principal), goal: uint, total-donated: uint, balance: uint, current-milestone: uint, is-active: bool, is-completed: bool}`
- [ ] Define `milestones` map: `{project-id: uint, milestone-id: uint} -> {description: (string-utf8 500), amount-requested: uint, approved: bool, funds-released: bool, vote-weight: uint}`
- [ ] Define `project-milestone-count` map: `uint -> uint`
- [ ] Define `donor-contributions` map: `{project-id: uint, donor: principal} -> uint`
- [ ] Define `total-project-donations` map: `uint -> uint`
- [ ] Define `has-voted` map: `{project-id: uint, milestone-id: uint, donor: principal} -> bool`
- [ ] Define `milestone-snapshot-donations` map: `{project-id: uint, milestone-id: uint} -> uint`

---

## Phase 3: Access Control & Pause Mechanism

### 3.1 Owner Verification
- [ ] Create private function `is-owner?` that checks `tx-sender` against `CONTRACT_OWNER`
- [ ] Use `asserts!` pattern for owner checks

### 3.2 Pause Controls
- [ ] Implement `pause` public function (owner only)
- [ ] Implement `unpause` public function (owner only)
- [ ] Create private helper `check-not-paused` for state-modifying functions
- [ ] Apply pause checks to donations and fund releases

---

## Phase 4: NGO Management

### 4.1 NGO Registration
- [ ] Implement `register-ngo` public function:
  - Check owner
  - Check not paused
  - Validate principal is not zero
  - Check NGO not already verified
  - Set `verified-ngos` map entry
  - Return `(ok true)`

### 4.2 NGO Revocation
- [ ] Implement `revoke-ngo` public function:
  - Check owner
  - Check NGO is verified
  - Set `verified-ngos` map entry to `false`
  - Return `(ok true)`

### 4.3 NGO Verification Check
- [ ] Implement `is-verified-ngo` read-only function:
  - Return `bool` from `verified-ngos` map with default `false`

---

## Phase 5: Project Creation

### 5.1 Project Creation Function
- [ ] Implement `create-project` public function:
  - Check caller is verified NGO
  - Check not paused
  - Validate goal > 0
  - Validate milestone arrays (same length, at least one milestone)
  - Validate all milestone amounts > 0
  - Validate sum of milestone amounts <= goal
  - Increment `project-counter`
  - Create project entry in `projects` map
  - Set `project-milestone-count`
  - Create all milestone entries in `milestones` map (recursive helper if needed)
  - Return `(ok project-id)`

### 5.2 Milestone Creation Helper
- [ ] Create private helper function to initialize milestones:
  - Iterate through descriptions and amounts arrays
  - Create map entries for each milestone
  - Handle Clarity's immutable list constraints

---

## Phase 6: STX Donations

### 6.1 STX Donation Function
- [ ] Implement `donate` public function:
  - Accept `project-id` (uint) and `amount` (uint) parameters
  - Check project exists
  - Check project is active and not completed
  - Check amount > 0
  - Check project accepts STX (donation-token is `none`)
  - Check not paused
  - Use `stx-transfer?` to transfer STX from `tx-sender` to contract
  - Update `donor-contributions` map
  - Update `total-project-donations` map
  - Update project's `total-donated` and `balance` fields
  - Return `(ok amount)`

### 6.2 Post-Conditions
- [ ] Add post-conditions for STX transfers:
  - Ensure STX is sent from sender
  - Ensure STX is received by contract

---

## Phase 7: SIP-010 Token Donations

### 7.1 Token Donation Function
- [ ] Implement `donate-token` public function:
  - Accept `project-id` (uint), `token-contract` (principal), `amount` (uint)
  - Check project exists and is active
  - Check amount > 0
  - Check project accepts this token (donation-token matches)
  - Check not paused
  - Call SIP-010 `transfer` function via `contract-call?`:
    - From: `tx-sender`
    - To: contract principal
    - Amount: `amount`
  - Update donation accounting maps
  - Return `(ok amount)`

### 7.2 SIP-010 Trait Definition
- [ ] Define or import SIP-010 trait for token transfers
- [ ] Use trait for type-safe token contract calls

---

## Phase 8: Milestone Voting

### 8.1 Voting Function
- [ ] Implement `vote-on-milestone` public function:
  - Accept `project-id` (uint)
  - Check project exists
  - Get current milestone ID from project
  - Check milestone exists and not approved
  - Check donor has contribution > 0
  - Check donor hasn't voted on this milestone
  - Check not paused
  - **Snapshot Logic**: If first vote for milestone, capture `total-project-donations` in `milestone-snapshot-donations`
  - Calculate vote weight from `donor-contributions`
  - Update milestone's `vote-weight`
  - Set `has-voted` map entry
  - Return `(ok vote-weight)`

### 8.2 Snapshot Mechanism
- [ ] Ensure snapshot is taken only on first vote
- [ ] Use snapshot for quorum calculations (not current total)

---

## Phase 9: Fund Release

### 9.1 Fund Release Function
- [ ] Implement `release-funds` public function:
  - Accept `project-id` (uint)
  - Check project exists
  - Check caller is project's NGO
  - Get current milestone
  - Check milestone not approved/released
  - Check quorum is met (>50% of snapshot)
  - Check project balance >= milestone amount
  - Check not paused
  - Mark milestone as approved and released
  - Decrement project balance
  - Increment `current-milestone`
  - Check if final milestone → mark project as completed/inactive
  - Transfer funds:
    - If STX: Use `stx-transfer?` from contract to NGO
    - If SIP-010: Use `contract-call?` to transfer token
  - Return `(ok amount-released)`

### 9.2 Post-Conditions for Transfers
- [ ] Add post-conditions:
  - STX: Ensure contract sends STX to NGO
  - Token: Ensure contract transfers tokens to NGO

---

## Phase 10: Emergency Controls

### 10.1 Emergency Withdrawal
- [ ] Implement `emergency-withdraw` public function:
  - Check owner
  - Check contract is paused
  - Check project exists
  - Withdraw all remaining balance:
    - If STX: Transfer to owner
    - If token: Transfer token to owner
  - Set project balance to 0
  - Return `(ok amount-withdrawn)`

---

## Phase 11: Read-Only Functions

### 11.1 Project Queries
- [ ] Implement `get-project` read-only function
- [ ] Implement `get-project-milestone-count` read-only function
- [ ] Implement `get-project-counter` read-only function

### 11.2 Milestone Queries
- [ ] Implement `get-milestone` read-only function
- [ ] Implement `get-current-milestone` read-only function

### 11.3 Donation Queries
- [ ] Implement `get-donor-contribution` read-only function
- [ ] Implement `get-total-project-donations` read-only function
- [ ] Implement `has-donor-voted` read-only function

### 11.4 Voting Status
- [ ] Implement `get-milestone-vote-status` read-only function:
  - Returns vote weight, snapshot, and `can-release` boolean

---

## Phase 12: Testing Infrastructure

### 12.1 Unit Tests
- [ ] Create `tests/ilenoid.test.ts`:
  - Test NGO registration/revocation
  - Test project creation
  - Test STX donations
  - Test token donations
  - Test voting
  - Test fund release
  - Test emergency controls
  - Test access control
  - Test pause mechanism

### 12.2 Integration Tests
- [ ] Test full project lifecycle:
  - Create project → Donate → Vote → Release funds
- [ ] Test multiple projects
- [ ] Test edge cases (quorum, insufficient balance, etc.)

### 12.3 Test Utilities
- [ ] Create helper functions for:
  - Deploying contracts
  - Creating test projects
  - Making donations
  - Voting on milestones

---

## Phase 13: Contract Validation & Optimization

### 13.1 Static Analysis
- [ ] Run `clarinet check` and fix all errors
- [ ] Run `clarinet fmt` to format code
- [ ] Review linter warnings (dead code, unused variables)

### 13.2 Gas/Cost Optimization
- [ ] Review contract call costs
- [ ] Optimize map lookups
- [ ] Minimize state changes
- [ ] Use `default-to` for map reads where appropriate

### 13.3 Security Review
- [ ] Review access control
- [ ] Review reentrancy patterns (Clarity is reentrancy-safe, but verify logic)
- [ ] Review post-conditions
- [ ] Review error handling

---

## Phase 14: Documentation

### 14.1 Contract Documentation
- [ ] Add inline comments for all functions
- [ ] Document data structures
- [ ] Document error codes
- [ ] Document post-conditions

### 14.2 API Documentation
- [ ] Document all public functions
- [ ] Document all read-only functions
- [ ] Provide usage examples

---

## Phase 15: Deployment Preparation

### 15.1 Deployment Scripts
- [ ] Create deployment plan in `deployments/`
- [ ] Configure deployment accounts
- [ ] Test deployment on devnet

### 15.2 Contract Verification
- [ ] Verify contract compiles
- [ ] Verify all tests pass
- [ ] Verify contract matches PRD requirements

---

## Key Differences: Solidity → Clarity

### Language Differences
1. **Types**: `address` → `principal`, `uint256` → `uint`, `string` → `(string-utf8 N)`
2. **Mappings**: `mapping(uint => Project)` → `(define-map projects uint {project-struct})`
3. **Structs**: Defined inline in maps or as tuple types
4. **Functions**: `function name() public` → `(define-public (name))`
5. **Returns**: `returns (uint)` → Returns value directly (or `(ok value)` / `(err code)`)
6. **Errors**: `revert Errors.XXX()` → `(err ERR_XXX)`
7. **Events**: Clarity doesn't have events (use print for debugging, or off-chain indexing)

### Token Differences
1. **Native Currency**: `ETH` → `STX` (use `stx-transfer?`)
2. **Token Standard**: `ERC20` → `SIP-010` (different interface)
3. **Transfers**: `token.transferFrom()` → `contract-call?` with SIP-010 trait

### Security Differences
1. **Reentrancy**: Clarity is reentrancy-safe by design
2. **Post-Conditions**: Stacks requires explicit post-conditions for asset transfers
3. **Immutability**: Clarity contracts are immutable (no upgrades)

### Testing Differences
1. **Framework**: Foundry → Clarinet + Vitest
2. **SDK**: `@stacks/clarinet-sdk` instead of Foundry's `vm`
3. **Simnet**: Local blockchain for testing

---

## Success Criteria

- [ ] All phases completed
- [ ] All tests passing
- [ ] Contract compiles without errors
- [ ] Contract matches PRD requirements
- [ ] Documentation complete
- [ ] Ready for deployment

---

## Notes

- Use Clarity 4 features where applicable
- Follow Clarity best practices from Stacks documentation
- Ensure all post-conditions are properly set
- Test thoroughly on simnet before mainnet deployment
- Consider gas/cost optimization throughout development

