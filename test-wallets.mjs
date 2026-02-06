import { generateSecretKey, generateWallet } from '@stacks/wallet-sdk';

const secretKey = generateSecretKey(); // Generates a random 24-word mnemonic
const wallet = await generateWallet({ secretKey, password: 'your-password' });

console.log("Mnemonic:", secretKey);
console.log("Address:", wallet.accounts[0].stxPrivateKey); // Access first account
