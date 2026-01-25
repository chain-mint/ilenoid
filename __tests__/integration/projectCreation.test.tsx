/**
 * Integration test for project creation flow
 * 
 * This test simulates the complete project creation flow:
 * 1. Connect NGO wallet
 * 2. Navigate to create page
 * 3. Fill form
 * 4. Submit project
 * 5. Verify project created
 * 
 * Note: This is a simplified integration test. In a real scenario,
 * you would use a testing library like Playwright or Cypress for
 * end-to-end testing with a real browser.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateProjectModal } from "@/components/project/CreateProjectModal";
import * as wagmi from "wagmi";
import * as ngoHooks from "@/hooks/useNGO";
import { useUIStore } from "@/stores/uiStore";

// Mock hooks
jest.mock("@/hooks/useNGO", () => ({
  useIsVerifiedNGO: jest.fn(),
}));

// Mock Zustand store
jest.mock("@/stores/uiStore", () => ({
  useUIStore: jest.fn(),
}));

describe("Project Creation Flow Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("allows verified NGO to create project", async () => {
    const user = userEvent.setup();
    const mockCloseModal = jest.fn();

    // Step 1: Connect NGO wallet
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    });

    // Step 2: NGO is verified
    (ngoHooks.useIsVerifiedNGO as jest.Mock).mockReturnValue({
      isVerified: true,
      isLoading: false,
      isError: false,
      error: null,
    });

    // Step 3: Modal is open
    (useUIStore as unknown as jest.Mock).mockReturnValue({
      isCreateProjectModalOpen: true,
      closeCreateProjectModal: mockCloseModal,
    });

    // Step 4: Mock write contract
    const mockWriteContract = jest.fn().mockResolvedValue(undefined);
    (wagmi.useWriteContract as jest.Mock).mockReturnValue({
      writeContract: mockWriteContract,
      data: undefined,
      isPending: false,
      error: null,
    });

    (wagmi.useWaitForTransactionReceipt as jest.Mock).mockReturnValue({
      isLoading: false,
      isSuccess: true,
      error: null,
    });

    // Step 5: Render create project modal
    render(<CreateProjectModal />);

    // Step 6: Verify form is rendered
    expect(screen.getByText(/create new project/i)).toBeInTheDocument();

    // Step 7: Fill form
    const goalInput = screen.getByLabelText(/fundraising goal/i);
    await user.type(goalInput, "10.0");

    const descriptionInput = screen.getByLabelText(/description/i);
    await user.type(descriptionInput, "Test milestone");

    const amountInput = screen.getByLabelText(/amount/i);
    await user.type(amountInput, "5.0");

    // Step 8: Submit form
    const submitButton = screen.getByRole("button", { name: /create project/i });
    await user.click(submitButton);

    // Step 9: Verify writeContract was called
    await waitFor(() => {
      expect(mockWriteContract).toHaveBeenCalled();
    });
  });

  it("prevents non-verified NGO from creating project", () => {
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    });

    // NGO is not verified
    (ngoHooks.useIsVerifiedNGO as jest.Mock).mockReturnValue({
      isVerified: false,
      isLoading: false,
      isError: false,
      error: null,
    });

    (useUIStore as unknown as jest.Mock).mockReturnValue({
      isCreateProjectModalOpen: true,
      closeCreateProjectModal: jest.fn(),
    });

    render(<CreateProjectModal />);

    expect(screen.getByText(/you are not a verified ngo/i)).toBeInTheDocument();
  });

  it("prevents unconnected wallet from creating project", () => {
    (wagmi.useAccount as jest.Mock).mockReturnValue({
      address: undefined,
      isConnected: false,
    });

    (ngoHooks.useIsVerifiedNGO as jest.Mock).mockReturnValue({
      isVerified: false,
      isLoading: false,
      isError: false,
      error: null,
    });

    (useUIStore as unknown as jest.Mock).mockReturnValue({
      isCreateProjectModalOpen: true,
      closeCreateProjectModal: jest.fn(),
    });

    render(<CreateProjectModal />);

    expect(screen.getByText(/please connect your wallet/i)).toBeInTheDocument();
  });
});

