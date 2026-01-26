"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

/**
 * Root providers component
 * Wraps the app with React Query and Toast providers
 * Note: Stacks uses @stacks/connect instead of wagmi
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance with optimized cache configuration
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
            gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time (formerly cacheTime)
            refetchOnWindowFocus: false,
            refetchOnMount: false, // Don't refetch on mount if data is fresh
            retry: 1, // Retry failed requests once
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333333",
            color: "#ffffff",
          },
          success: {
            iconTheme: {
              primary: "#2ECC71", // Emerald Green
              secondary: "#ffffff",
            },
            className: "toast-success",
            style: {
              background: "#2ECC71", // Emerald Green
              color: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#E74C3C", // Charity Red
              secondary: "#ffffff",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

