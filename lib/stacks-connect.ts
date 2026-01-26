import { connect, disconnect, isConnected, getLocalStorage, request } from "@stacks/connect";
import { isMainnet } from "./stacks";

/**
 * Stacks Connect configuration and utilities
 * Handles wallet connection and authentication
 */

export interface StacksUserData {
  addresses: {
    stx: Array<{ address: string }>;
    btc?: Array<{ address: string }>;
  };
}

/**
 * Connect to Stacks wallet
 * Only works on client side (browser)
 */
export const connectStacksWallet = async (): Promise<any> => {
  if (typeof window === 'undefined') return null;
  try {
    if (isConnected()) {
      return getLocalStorage();
    }

    const response = await connect({
      network: isMainnet ? "mainnet" : "testnet",
    });

    return response;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    return null;
  }
};

/**
 * Disconnect from Stacks wallet
 */
export const disconnectStacksWallet = (): void => {
  disconnect();
};

/**
 * Check if wallet is connected
 * Only works on client side (browser)
 */
export const isWalletConnected = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return isConnected();
  } catch (error) {
    return false;
  }
};

/**
 * Get current user data from local storage
 * Only works on client side (browser)
 */
export const getStacksUserData = (): StacksUserData | null => {
  if (typeof window === 'undefined') return null;
  try {
    return getLocalStorage();
  } catch (error) {
    return null;
  }
};

/**
 * Get STX address from connected wallet
 * Only works on client side (browser)
 */
export const getStxAddress = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userData = getLocalStorage();
    return userData?.addresses?.stx?.[0]?.address || null;
  } catch (error) {
    return null;
  }
};

/**
 * Request method for wallet interactions
 * Used for contract calls, transfers, etc.
 */
export const requestStacksMethod = async (
  method: string,
  params: any
): Promise<any> => {
  try {
    return await request(method as any, params);
  } catch (error) {
    console.error(`Failed to execute ${method}:`, error);
    throw error;
  }
};

