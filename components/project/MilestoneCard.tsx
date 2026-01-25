"use client";

import { memo, useMemo } from "react";
import { type Milestone } from "@/types/contract";
import { Card, CardBody } from "@/components/ui/Card";
import { formatEther, formatUSDC } from "@/lib/utils";
import { isAddress } from "viem";
import { USDC_ADDRESS } from "@/lib/contract";

export interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
  currentMilestoneIndex: bigint;
  donationToken: string;
}

type MilestoneStatus = "completed" | "current" | "pending";

/**
 * MilestoneCard component for displaying milestone information
 * Memoized to prevent unnecessary re-renders
 */
export const MilestoneCard = memo(function MilestoneCard({
  milestone,
  index,
  currentMilestoneIndex,
  donationToken,
}: MilestoneCardProps) {
  // Memoize expensive calculations
  const { status, formattedAmount, borderColor } = useMemo(() => {
    // Determine milestone status
    const milestoneIndex = BigInt(index);
    let milestoneStatus: MilestoneStatus = "pending";
    if (milestone.approved && milestone.fundsReleased) {
      milestoneStatus = "completed";
    } else if (milestoneIndex === currentMilestoneIndex) {
      milestoneStatus = "current";
    }

    // Determine if token is ETH or ERC20
    const isETH = donationToken === "0x0000000000000000000000000000000000000000" || !isAddress(donationToken);
    const isUSDC = donationToken.toLowerCase() === USDC_ADDRESS.toLowerCase();

    // Format amount based on token type
    const amount = isETH
      ? `${formatEther(milestone.amountRequested)} ETH`
      : isUSDC
      ? `${formatUSDC(milestone.amountRequested)} USDC`
      : `${formatEther(milestone.amountRequested)} tokens`;

    // Status border colors
    const borderColors: Record<MilestoneStatus, string> = {
      completed: "border-emerald-green border-2",
      current: "border-bitcoin-orange border-2",
      pending: "border-slate-grey border opacity-30",
    };

    return {
      status: milestoneStatus,
      formattedAmount: amount,
      borderColor: borderColors[milestoneStatus],
    };
  }, [milestone, index, currentMilestoneIndex, donationToken]);

  return (
    <Card
      variant="outlined"
      className={`${borderColor} transition-all`}
    >
      <CardBody>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-slate-grey">
              Milestone {index + 1}
            </span>
            {status === "completed" && (
              <span className="text-emerald-green" aria-label="Completed">
                ✓
              </span>
            )}
            {status === "current" && (
              <span className="px-2 py-0.5 bg-bitcoin-orange text-white text-xs rounded-full">
                Current
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-slate-grey opacity-70 mb-1">Description:</p>
            <p className="text-slate-grey">{milestone.description}</p>
          </div>

          <div>
            <p className="text-sm text-slate-grey opacity-70 mb-1">Amount Requested:</p>
            <p className="font-semibold text-slate-grey">{formattedAmount}</p>
          </div>

          <div className="flex gap-4 text-xs">
            <div>
              <span className="text-slate-grey opacity-70">Approved: </span>
              <span
                className={
                  milestone.approved
                    ? "text-emerald-green font-medium"
                    : "text-slate-grey opacity-50"
                }
              >
                {milestone.approved ? "Yes" : "No"}
              </span>
            </div>
            <div>
              <span className="text-slate-grey opacity-70">Funds Released: </span>
              <span
                className={
                  milestone.fundsReleased
                    ? "text-emerald-green font-medium"
                    : "text-slate-grey opacity-50"
                }
              >
                {milestone.fundsReleased ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
});

