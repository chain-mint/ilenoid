import { connect, disconnect, isConnected, getLocalStorage, request } from "@stacks/connect";
import { stacksNetwork } from "./stacks";

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
 */
export const connectStacksWallet = async (): Promise<StacksUserData | null> => {
  try {
    if (isConnected()) {
      return getLocalStorage();
    }

    const response = await connect({
      network: stacksNetwork,
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
 */
export const isWalletConnected = (): boolean => {
  return isConnected();
};

/**
 * Get current user data from local storage
 */
export const getStacksUserData = (): StacksUserData | null => {
  return getLocalStorage();
};

/**
 * Get STX address from connected wallet
 */
export const getStxAddress = (): string | null => {
  const userData = getLocalStorage();
  return userData?.addresses?.stx?.[0]?.address || null;
};

/**
 * Request method for wallet interactions
 * Used for contract calls, transfers, etc.
 */
export const requestStacksMethod = async <T extends string>(
  method: T,
  params: any
): Promise<any> => {
  try {
    return await request(method, params);
  } catch (error) {
    console.error(`Failed to execute ${method}:`, error);
    throw error;
  }
};

