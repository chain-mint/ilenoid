"use client";

import { useState, useEffect } from "react";
import { useConnection } from "@/hooks/useConnection";
import { useDonateSTX } from "@/hooks/useDonation";
import { getStxAddress } from "@/lib/stacks-connect";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { USDC_ADDRESS } from "@/lib/contract";
import { parseContractError } from "@/lib/errors";
import { validateAmount as validateAmountUtil } from "@/lib/validation";
import toast from "react-hot-toast";

export interface DonateFormProps {
  projectId: number | bigint;
  donationToken: string; // For Stacks, this is just a string identifier
  onSuccess?: () => void;
}

/**
 * DonateForm component for making STX donations
 */
export function DonateForm({ projectId, donationToken, onSuccess }: DonateFormProps) {
  const { address, isConnected } = useConnection();
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  // For Stacks, we use STX (native token)
  const tokenName = "STX";
  const tokenDecimals = 6; // STX uses 6 decimals (microSTX)

  // Get STX balance (simplified - in production you'd fetch from Stacks API)
  const stxAddress = getStxAddress();
  const { data: stxBalance } = useQuery({
    queryKey: ["stxBalance", stxAddress],
    queryFn: async () => {
      // In production, fetch from Stacks API
      // For now, return 0 as placeholder
      return BigInt(0);
    },
    enabled: !!stxAddress && isConnected,
  });

  const formattedBalance = stxBalance ? (Number(stxBalance) / 1_000_000).toFixed(6) : "0";

  // Donation hook for STX
  const {
    donate: donateSTX,
    isPending,
    isSuccess,
    error: donationError,
  } = useDonateSTX(projectId);

  // Display error from hook if present
  useEffect(() => {
    if (donationError) {
      const errorMessage = parseContractError(donationError);
      setError(errorMessage);
    }
  }, [donationError]);

  // Handle success - close modal if callback provided
  useEffect(() => {
    if (isSuccess && onSuccess) {
      // Delay to show success message before closing
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  }, [isSuccess, onSuccess]);

  // Validate amount
  const validateAmount = (value: string): string => {
    if (!value || value.trim() === "") {
      return "";
    }

    // Use validation utility
    if (!validateAmountUtil(value)) {
      return "Amount must be greater than 0";
    }

    // Check if amount exceeds balance (if balance is available)
    if (stxBalance) {
      const numValue = parseFloat(value);
      const balanceNum = parseFloat(formattedBalance);
      if (numValue > balanceNum) {
        return `Insufficient balance. You have ${formattedBalance} ${tokenName}`;
      }
    }

    return "";
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    setError(validateAmount(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validate amount
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isConnected || !address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      // For Stacks, always use STX donation
      await donateSTX(amount);
      // Clear form on success (handled by hook's success effect)
      setAmount("");
    } catch (err) {
      // Parse and display error
      const errorMessage = parseContractError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Donation error:", err);
    }
  };

  if (!isConnected) {
    return (
      <Card variant="outlined">
        <CardBody>
          <p className="text-center text-slate-grey opacity-70">
            Please connect your wallet to make a donation
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardBody>
        <h3 className="text-lg font-semibold text-slate-grey mb-4">
          Make a Donation
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Balance display */}
          <div className="text-sm">
            <span className="text-slate-grey opacity-70">Your balance: </span>
            <span className="font-medium text-slate-grey">
              {formattedBalance} {tokenName}
            </span>
          </div>

          {/* Amount input */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-slate-grey mb-2"
            >
              Amount ({tokenName})
            </label>
            <input
              id="amount"
              type="number"
              step="any"
              min="0"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              disabled={isPending}
              className="w-full px-4 py-2 border border-slate-grey border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-green focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {error && (
              <p className="mt-1 text-sm text-charity-red">{error}</p>
            )}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isPending}
            disabled={isPending || !!error || !amount || parseFloat(amount) <= 0}
          >
            {isPending ? "Processing..." : `Donate ${tokenName}`}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

