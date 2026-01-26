"use client";

import { useState, useEffect } from "react";
import { useConnection } from "@/hooks/useConnection";
import { Card, CardBody } from "@/components/ui/Card";

/**
 * NetworkError component for handling wallet disconnection
 * Note: Stacks doesn't have network switching like Ethereum
 */
export function NetworkError() {
  const { isConnected } = useConnection();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only checking after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent false positives
  if (!mounted) {
    return null;
  }

  // Check if disconnected
  const isDisconnected = !isConnected;

  // Don't show if connected
  if (!isDisconnected) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <Card variant="outlined" className="border-charity-red border-2 bg-white shadow-lg">
        <CardBody>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-charity-red rounded-full mt-1"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-charity-red mb-1">
                Wallet Disconnected
              </h3>
              <p className="text-xs text-slate-grey opacity-70 mb-2">
                Please connect your wallet to use this application.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

