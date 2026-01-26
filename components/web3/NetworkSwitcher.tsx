"use client";

import { useConnection } from "@/hooks/useConnection";
import { useEffect, useState } from "react";
import { isMainnet } from "@/lib/stacks";

/**
 * NetworkSwitcher component for Stacks network
 * Shows current network status (Stacks doesn't have network switching like Ethereum)
 */
export function NetworkSwitcher() {
  const { isConnected } = useConnection();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted || !isConnected) {
    return null;
  }

  const networkName = isMainnet ? "Stacks Mainnet" : "Stacks Testnet";

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-green bg-opacity-10 rounded-lg">
      <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
      <span className="text-sm font-medium text-slate-grey">
        {networkName}
      </span>
    </div>
  );
}

