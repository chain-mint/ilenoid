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

describe("DonateForm Component", () => {
  const mockProjectId = BigInt(1);
  const mockDonationToken = "0x0000000000000000000000000000000000000000" as const;

  beforeEach(() => {
    jest.clearAllMocks();
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    });
    (wagmi.useBalance as jest.Mock).mockReturnValue({
      data: {
        value: BigInt("1000000000000000000"), // 1 ETH
        decimals: 18,
        symbol: "ETH",
        formatted: "1.0",
      },
      isLoading: false,
    });
    (donationHooks.useDonateETH as jest.Mock).mockReturnValue({
      donate: jest.fn(),
      isPending: false,
      isConfirming: false,
      isSuccess: false,
      error: null,
    });
    (donationHooks.useDonateERC20 as jest.Mock).mockReturnValue({
      donate: jest.fn(),
      isPending: false,
      isConfirming: false,
      isSuccess: false,
      error: null,
      allowance: BigInt(0),
    });
  });

  it("renders donation form when connected", () => {
    render(<DonateForm projectId={mockProjectId} donationToken={mockDonationToken} />);
    expect(screen.getByText(/make a donation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
  });

  it("shows wallet connection message when not connected", () => {
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: undefined,
      isConnected: false,
    });

    render(<DonateForm projectId={mockProjectId} donationToken={mockDonationToken} />);
    expect(screen.getByText(/please connect your wallet/i)).toBeInTheDocument();
  });

  it("displays wallet balance", () => {
    render(<DonateForm projectId={mockProjectId} donationToken={mockDonationToken} />);
    expect(screen.getByText(/your balance:/i)).toBeInTheDocument();
    expect(screen.getByText(/1.0 ETH/i)).toBeInTheDocument();
  });

  it("validates amount input", async () => {
    const user = userEvent.setup();
    render(<DonateForm projectId={mockProjectId} donationToken={mockDonationToken} />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, "0");

    const submitButton = screen.getByRole("button", { name: /donate/i });
    expect(submitButton).toBeDisabled();
  });

  it("validates insufficient balance", async () => {
    const user = userEvent.setup();
    render(<DonateForm projectId={mockProjectId} donationToken={mockDonationToken} />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, "2.0");

    await waitFor(() => {
      expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument();
    });
  });

  it("calls donate function on form submission", async () => {
    const user = userEvent.setup();
    const mockDonate = jest.fn().mockResolvedValue(undefined);
    (donationHooks.useDonateETH as jest.Mock).mockReturnValue({
      donate: mockDonate,
      isPending: false,
      isConfirming: false,
      isSuccess: false,
      error: null,
    });

    render(<DonateForm projectId={mockProjectId} donationToken={mockDonationToken} />);

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, "0.1");

    const submitButton = screen.getByRole("button", { name: /donate/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockDonate).toHaveBeenCalledWith("0.1");
    });
  });

  it("shows loading state during transaction", () => {
    (donationHooks.useDonateETH as jest.Mock).mockReturnValue({
      donate: jest.fn(),
      isPending: true,
      isConfirming: false,
      isSuccess: false,
      error: null,
    });

    render(<DonateForm projectId={mockProjectId} donationToken={mockDonationToken} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/processing/i);
  });
});

