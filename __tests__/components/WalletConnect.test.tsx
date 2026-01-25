import React from "react";
import { render, screen } from "@testing-library/react";
import { WalletConnect } from "@/components/web3/WalletConnect";
import * as wagmi from "wagmi";

describe("WalletConnect Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders connect button when not connected", () => {
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: undefined,
      isConnected: false,
    });

    render(<WalletConnect />);
    expect(screen.getByRole("button", { name: /connect wallet/i })).toBeInTheDocument();
  });

  it("renders disconnect button when connected", () => {
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    });

    render(<WalletConnect />);
    expect(screen.getByRole("button", { name: /disconnect/i })).toBeInTheDocument();
  });

  it("displays formatted address when connected", () => {
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    });

    render(<WalletConnect />);
    expect(screen.getByText(/0x1234...7890/i)).toBeInTheDocument();
  });

  it("calls connect when connect button is clicked", () => {
    const mockConnect = jest.fn();
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: undefined,
      isConnected: false,
    });
    (wagmi.useConnect as jest.Mock).mockReturnValue({
      connect: mockConnect,
      connectors: [{ id: "injected" }],
      isPending: false,
      error: null,
    });

    render(<WalletConnect />);
    const connectButton = screen.getByRole("button", { name: /connect wallet/i });
    connectButton.click();

    expect(mockConnect).toHaveBeenCalled();
  });

  it("calls disconnect when disconnect button is clicked", () => {
    const mockDisconnect = jest.fn();
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    });
    (wagmi.useDisconnect as jest.Mock).mockReturnValue({
      disconnect: mockDisconnect,
    });

    render(<WalletConnect />);
    const disconnectButton = screen.getByRole("button", { name: /disconnect/i });
    disconnectButton.click();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it("shows loading state when connecting", () => {
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: undefined,
      isConnected: false,
    });
    (wagmi.useConnect as jest.Mock).mockReturnValue({
      connect: jest.fn(),
      connectors: [{ id: "injected" }],
      isPending: true,
      error: null,
    });

    render(<WalletConnect />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});

