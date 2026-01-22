"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/Button";
import { formatAddress } from "@/lib/utils";
import toast from "react-hot-toast";
import { useEffect } from "react";

/**
 * WalletConnect component for connecting and disconnecting wallets
 */
export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  // Handle connection errors
  useEffect(() => {
    if (error) {
      toast.error(
        error.message || "Failed to connect wallet. Please try again."
      );
    }
  }, [error]);

  // Handle successful connection
  useEffect(() => {
    if (isConnected && address) {
      toast.success("Wallet connected successfully!");
    }
  }, [isConnected, address]);

  const handleConnect = () => {
    // Try to connect with the first available connector (usually injected/MetaMask)
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    } else {
      toast.error("No wallet connector available");
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success("Wallet disconnected");
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
          <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
          <span className="text-sm font-medium text-slate-grey">
            {formatAddress(address)}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDisconnect}
          disabled={isPending}
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="primary"
      size="md"
      onClick={handleConnect}
      isLoading={isPending}
      disabled={isPending}
    >
      Connect Wallet
    </Button>
  );
}

