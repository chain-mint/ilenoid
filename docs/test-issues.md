# Test Coverage Issues (Stacks/Clarinet)

This document outlines the plan to restructure and expand the test suite for the Ilenoid Stacks contract.

---

### **Issue #0: Fix Test Environment Configuration**
**Issue Title**: Fix Vitest/Clarinet SDK Dependency Issue
**Description**: The current test execution fails with `Error: Missing "./vitest-helpers/src/clarityValuesMatchers" specifier in "@stacks/clarinet-sdk" package`. This appears to be a regression in `@stacks/clarinet-sdk` v3.13.1 where internal paths are not correctly exported.
**Tasks**:
- [ ] Investigate `vitest.config.ts` and `@stacks/clarinet-sdk` version.
- [ ] Downgrade `@stacks/clarinet-sdk` to a stable version (e.g., 3.10.0) or patch the import in `vitest.setup.ts`.
- [ ] Ensure `npm run test` executes successfully.

**Deliverable**: A working test environment.

---

### **Issue #1: Modularize Test Suite**
**Issue Title**: Refactor and Split Monolithic Test File
**Description**: The current `ilenoid.test.ts` is a monolithic file containing all test cases. This makes maintenance difficult. We need to split it into modular test files based on functionality, utilizing the existing `helpers.ts` as a shared fixture.
**Tasks**:
- [x] Create `contract/tests/ngo-management.test.ts` (Register/Revoke NGO)
- [x] Create `contract/tests/project-creation.test.ts` (Create project, validations)
- [x] Create `contract/tests/donations-stx.test.ts` (STX donations)
- [x] Create `contract/tests/voting.test.ts` (Milestone voting logic)
- [x] Create `contract/tests/fund-release.test.ts` (Fund release & project completion)
- [x] Create `contract/tests/admin-controls.test.ts` (Pause/Unpause, Emergency Withdraw)
- [x] Create `contract/tests/integration.test.ts` (Full lifecycle flows)
- [x] Create `contract/tests/view-functions.test.ts` (Read-only checks)
- [x] Ensure all new files import helpers correctly.

**Deliverable**: A clean, modular `contract/tests/` directory.

---

### **Issue #2: Add SIP-010 Token Support Tests**
**Issue Title**: Add Tests for SIP-010 Token Donations and Management
**Description**: The contract supports SIP-010 token donations (`donate-token`, `release-funds` with token, `emergency-withdraw` with token), but currently ONLY STX donations are tested. We need to deploy a mock SIP-010 token and test these flows.
**Tasks**:
- [ ] Create a Mock SIP-010 contract (or use an existing one if available in `contracts/`).
- [ ] Add `donateToken` helper to `helpers.ts` (already exists, verify usage).
- [ ] Test `donate-token` with valid and invalid tokens.
- [ ] Test `release-funds` for token-based projects.
- [ ] Test `emergency-withdraw` for token-based projects.
- [ ] Verify token balances update correctly for users and the contract.

**Deliverable**: Comprehensive tests for all SIP-010 related functionality.

---

### **Issue #3: Expanded Error Handling & Edge Cases**
**Issue Title**: Comprehensive Error and Edge Case Testing
**Description**: While happy paths are covered, many error conditions defined in the contract need explicit tests to ensure they trigger correctly.
**Tasks**:
- [ ] Test `ERR_MILESTONE_SUM_EXCEEDS_GOAL` and other project creation errors.
- [ ] Test `ERR_INSUFFICIENT_ALLOWANCE` / `ERR_INSUFFICIENT_BALANCE` for tokens.
- [ ] Test `ERR_QUORUM_NOT_MET` with exact boundary values.
- [ ] Test `ERR_MILESTONE_ALREADY_RELEASED` and `ERR_MILESTONE_ALREADY_APPROVED`.
- [ ] Test Re-voting scenarios (ensure `ERR_ALREADY_VOTED`).
- [ ] Test Snapshot logic: Ensure donations *after* voting starts do not increase voting power for that milestone.

**Deliverable**: High test coverage for all error constants and edge logic.

---

### **Issue #4: View Function Verification**
**Issue Title**: Verify Read-Only Functions
**Description**: Ensure all read-only functions return correct data structures, especially `get-milestone-vote-status` which has complex tuple return types.
**Tasks**:
- [ ] Verify `get-milestone-vote-status` returns correct `can-release` boolean under various conditions.
- [ ] Verify `get-project` returns correct `is-active` / `is-completed` status.
- [ ] Verify `get-donor-contribution` accuracy with mixed donation types (if applicable, though map is split? No, map key is `{project, donor}`).
    *   *Note*: The contract stores donations in `donor-contributions` as `uint`. Does it distinguish between STX and Token amounts?
    *   *Analysis*: The contract uses the SAME map `donor-contributions` for both STX and Tokens. This implies a project is *either* STX *or* Token (defined by `donation-token`).
    *   *Task*: Verify that `get-donor-contribution` returns the correct raw amount for the specific project type.

**Deliverable**: Verified data integrity for all view functions.
