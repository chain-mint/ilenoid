import { renderHook, waitFor } from "@testing-library/react";
import { useVoteMilestone } from "@/hooks/useVoting";
import * as wagmi from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useVoteMilestone Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns initial state", () => {
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    });
    (wagmi.useWriteContract as jest.Mock).mockReturnValue({
      writeContract: jest.fn(),
      data: undefined,
      isPending: false,
      error: null,
    });
    (wagmi.useWaitForTransactionReceipt as jest.Mock).mockReturnValue({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useVoteMilestone(BigInt(1)), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isConfirming).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("calls writeContract when vote is called", async () => {
    const mockWriteContract = jest.fn().mockResolvedValue(undefined);
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    });
    (wagmi.useWriteContract as jest.Mock).mockReturnValue({
      writeContract: mockWriteContract,
      data: undefined,
      isPending: false,
      error: null,
    });
    (wagmi.useWaitForTransactionReceipt as jest.Mock).mockReturnValue({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useVoteMilestone(BigInt(1)), {
      wrapper: createWrapper(),
    });

    await result.current.vote();

    await waitFor(() => {
      expect(mockWriteContract).toHaveBeenCalled();
    });
  });

  it("handles transaction success", async () => {
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    });
    (wagmi.useWriteContract as jest.Mock).mockReturnValue({
      writeContract: jest.fn().mockResolvedValue(undefined),
      data: "0x1234567890123456789012345678901234567890123456789012345678901234",
      isPending: false,
      error: null,
    });
    (wagmi.useWaitForTransactionReceipt as jest.Mock).mockReturnValue({
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useVoteMilestone(BigInt(1)), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("handles transaction error", () => {
    const mockError = new Error("Transaction failed");
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    });
    (wagmi.useWriteContract as jest.Mock).mockReturnValue({
      writeContract: jest.fn(),
      data: undefined,
      isPending: false,
      error: mockError,
    });
    (wagmi.useWaitForTransactionReceipt as jest.Mock).mockReturnValue({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useVoteMilestone(BigInt(1)), {
      wrapper: createWrapper(),
    });

    expect(result.current.error).toBe(mockError);
  });
});

