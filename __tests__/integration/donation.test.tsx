/**
 * Integration test for donation flow
 * 
 * This test simulates the complete donation flow:
 * 1. Connect wallet
 * 2. Navigate to project
 * 3. Fill donation form
 * 4. Submit donation
 * 5. Verify success
 * 
 * Note: This is a simplified integration test. In a real scenario,
 * you would use a testing library like Playwright or Cypress for
 * end-to-end testing with a real browser.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DonateForm } from "@/components/donation/DonateForm";
import * as wagmi from "wagmi";
import * as donationHooks from "@/hooks/useDonation";

// Mock donation hooks
jest.mock("@/hooks/useDonation", () => ({
  useDonateETH: jest.fn(),
  useDonateERC20: jest.fn(),
}));

describe("Donation Flow Integration", () => {
  const mockProjectId = BigInt(1);
  const mockDonationToken = "0x0000000000000000000000000000000000000000" as const;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("completes donation flow successfully", async () => {
    const user = userEvent.setup();
    const mockDonate = jest.fn().mockResolvedValue(undefined);

    // Step 1: Connect wallet
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    });

    // Step 2: Set up balance
    (wagmi.useBalance as jest.Mock).mockReturnValue({
      data: {
        value: BigInt("1000000000000000000"), // 1 ETH
        decimals: 18,
        symbol: "ETH",
        formatted: "1.0",
      },
      isLoading: false,
    });

    // Step 3: Set up donation hook
    (donationHooks.useDonateETH as jest.Mock).mockReturnValue({
      donate: mockDonate,
      isPending: false,
      isConfirming: false,
      isSuccess: false,
      error: null,
    });

    // Step 4: Render donation form
    render(<DonateForm projectId={mockProjectId} donationToken={mockDonationToken} />);

    // Step 5: Verify form is rendered
    expect(screen.getByText(/make a donation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();

    // Step 6: Fill donation form
    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, "0.1");

    // Step 7: Submit donation
    const submitButton = screen.getByRole("button", { name: /donate/i });
    await user.click(submitButton);

    // Step 8: Verify donation was called
    await waitFor(() => {
      expect(mockDonate).toHaveBeenCalledWith("0.1");
    });
  });

  it("handles donation error gracefully", async () => {
    const user = userEvent.setup();
    const mockError = new Error("Transaction failed");
    const mockDonate = jest.fn().mockRejectedValue(mockError);

    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    });

    (wagmi.useBalance as jest.Mock).mockReturnValue({
      data: {
        value: BigInt("1000000000000000000"),
        decimals: 18,
        symbol: "ETH",
        formatted: "1.0",
      },
      isLoading: false,
    });

    (donationHooks.useDonateETH as jest.Mock).mockReturnValue({
      donate: mockDonate,
      isPending: false,
      isConfirming: false,
      isSuccess: false,
      error: mockError,
    });

    render(<DonateForm projectId={mockProjectId} donationToken={mockDonationToken} />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, "0.1");

    const submitButton = screen.getByRole("button", { name: /donate/i });
    await user.click(submitButton);

    // Error should be handled by the hook
    await waitFor(() => {
      expect(mockDonate).toHaveBeenCalled();
    });
  });
});

