"use client";

import { Button } from "@/components/ui/Button";
import { formatAddress } from "@/lib/utils";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  connectStacksWallet,
  disconnectStacksWallet,
  isWalletConnected,
  getStxAddress,
} from "@/lib/stacks-connect";

/**
 * WalletConnect component for connecting and disconnecting Stacks wallets
 */
export function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
    checkConnection();
  }, []);

  // Check connection status
  const checkConnection = () => {
    const connected = isWalletConnected();
    const currentAddress = getStxAddress();
    setIsConnected(connected);
    setAddress(currentAddress);
  };

  // Listen for connection changes
  useEffect(() => {
    const interval = setInterval(() => {
      checkConnection();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const userData = await connectStacksWallet();
      if (userData) {
        const stxAddress = userData.addresses?.stx?.[0]?.address;
        if (stxAddress) {
          setAddress(stxAddress);
          setIsConnected(true);
          toast.success("Wallet connected successfully!");
        } else {
          toast.error("Failed to get wallet address");
        }
      } else {
        // userData is null - this could be a user rejection or an error
        // Don't show error toast as user rejection is handled silently
        // Only show error if it's an actual connection failure (caught in catch block)
      }
    } catch (error: any) {
      // Only actual errors reach here (not user rejections)
      console.error("Connection error:", error);
      toast.error(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectStacksWallet();
    setAddress(null);
    setIsConnected(false);
    toast.success("Wallet disconnected");
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="primary" size="md" disabled>
        Connect Wallet
      </Button>
    );
  }

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
          disabled={isConnecting}
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
      isLoading={isConnecting}
      disabled={isConnecting}
    >
      Connect Wallet
    </Button>
  );
}
