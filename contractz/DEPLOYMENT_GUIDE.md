# Deployment Guide for Stacks Builder Rewards

## Quick Answer
**YES** - If you deploy the contract from your address `ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q`, it **WILL count** toward the Stacks Builder Rewards program. The deployment transaction will be associated with your address.

## Step-by-Step Deployment

### 1. Configure Your Deployer Account

Edit `settings/Testnet.toml` and add your mnemonic that corresponds to address `ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q`:

```toml
[network]
name = "testnet"
stacks_node_rpc_address = "https://api.testnet.hiro.so"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "<YOUR 24-WORD MNEMONIC FOR ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q>"
# Optional: specify derivation path if needed
# derivation = "m/44'/5757'/0'/0/0"
```

**Security Note**: For production/mainnet, use encrypted mnemonics:
```bash
clarinet deployments encrypt
```
Then use `encrypted_mnemonic` instead of `mnemonic` in the config.

### 2. Verify Your Account Has STX

Make sure your address has testnet STX for deployment fees:
- Check balance: https://explorer.stacks.co/address/ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q?chain=testnet
- Get testnet STX: https://explorer.stacks.co/sandbox/faucet

### 3. Generate Deployment Plan

```bash
cd contractz
clarinet deployments generate --testnet --medium-cost
```

This creates `deployments/default.testnet-plan.yaml` with your address as the deployer.

### 4. Review the Deployment Plan

Check `deployments/default.testnet-plan.yaml` to verify:
- `expected-sender` matches your address `ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q`
- Contract costs are acceptable
- All contracts are included

### 5. Deploy to Testnet

```bash
clarinet deployments apply --testnet
```

Clarinet will:
1. Ask for confirmation
2. Sign transactions with your mnemonic
3. Broadcast to testnet
4. Wait for confirmation

### 6. Verify Deployment

After deployment, verify on the explorer:
- Contract address: `ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q.ilenoid`
- Check: https://explorer.stacks.co/address/ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q?chain=testnet

### 7. For Mainnet (After Testing)

Once tested on testnet, deploy to mainnet:

1. Update `settings/Mainnet.toml` with your mainnet mnemonic
2. Generate plan: `clarinet deployments generate --mainnet --high-cost`
3. Deploy: `clarinet deployments apply --mainnet`

## Important Notes for Rewards Program

1. **Deployment Address Matters**: The rewards program tracks the address that deploys the contract. Your address `ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q` must be the deployer.

2. **Network**: The rewards program likely tracks both testnet and mainnet deployments. Deploy to testnet first for testing, then mainnet for production.

3. **Contract Verification**: Make sure your contract is:
   - ✅ Compiling without errors (`clarinet check`)
   - ✅ All tests passing (`npm test`)
   - ✅ Deployed from your address
   - ✅ Verified on the explorer

4. **Transaction Visibility**: The deployment transaction will be visible on the Stacks explorer and associated with your address, which is what the rewards program uses for tracking.

## Troubleshooting

### "Insufficient funds"
- Get testnet STX from faucet: https://explorer.stacks.co/sandbox/faucet
- Check your balance matches the deployment cost

### "Wrong address in deployment plan"
- Verify your mnemonic in `settings/Testnet.toml` matches address `ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q`
- Regenerate deployment plan: `clarinet deployments generate --testnet --medium-cost`

### "Contract already exists"
- If deploying to same address, you need to increment contract name or use a different address
- Check existing contracts: https://explorer.stacks.co/address/ST2W758Q6BS97GWK7STXTAW2ZG26YFXE4V5WMTG3Q?chain=testnet

## Resources

- [Stacks Builder Rewards](https://talent.app/~/earn/stacks-builder-rewards-jan)
- [Clarinet Deployment Docs](https://docs.stacks.co/build/clarinet/contract-deployment)
- [Stacks Explorer](https://explorer.stacks.co)
- [Testnet Faucet](https://explorer.stacks.co/sandbox/faucet)

