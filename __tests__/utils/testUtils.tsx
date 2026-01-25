import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";

/**
 * Test utilities for rendering components with providers
 */

/**
 * Creates a QueryClient for testing
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });
}

/**
 * Wrapper component for testing with all providers
 */
export function AllTheProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

/**
 * Custom render function with providers
 */
export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();

  return {
    queryClient,
    ...require("@testing-library/react").render(
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </WagmiProvider>
    ),
  };
}

