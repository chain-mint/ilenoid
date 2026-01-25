"use client";

import Link from "next/link";
import { memo, useMemo } from "react";
import { type Project } from "@/types/contract";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatAddress, formatEther, formatUSDC, formatPercentage } from "@/lib/utils";
import { isAddress } from "viem";
import { USDC_ADDRESS } from "@/lib/contract";
import { useUIStore } from "@/stores/uiStore";

export interface ProjectCardProps {
  project: Project;
}

/**
 * ProjectCard component for displaying project information in a card
 * Memoized to prevent unnecessary re-renders
 */
export const ProjectCard = memo(function ProjectCard({ project }: ProjectCardProps) {
  const { openDonateModal } = useUIStore();

  const handleDonateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openDonateModal(project.id);
  };

  // Memoize expensive calculations
  const { progressPercentage, formattedGoal, formattedDonated, status } = useMemo(() => {
    // Calculate progress percentage
    const progress =
      project.goal > BigInt(0)
        ? formatPercentage(Number(project.totalDonated), Number(project.goal))
        : "0.0";

    // Determine if token is ETH (address(0)) or ERC20
    const isETH = project.donationToken === "0x0000000000000000000000000000000000000000" || !isAddress(project.donationToken);
    const isUSDC = project.donationToken.toLowerCase() === USDC_ADDRESS.toLowerCase();

    // Format amounts based on token type
    const goal = isETH
      ? `${formatEther(project.goal)} ETH`
      : isUSDC
      ? `${formatUSDC(project.goal)} USDC`
      : `${formatEther(project.goal)} tokens`;

    const donated = isETH
      ? formatEther(project.totalDonated)
      : isUSDC
      ? formatUSDC(project.totalDonated)
      : formatEther(project.totalDonated);

    // Determine status
    const projectStatus = project.isCompleted
      ? { label: "Completed", color: "bg-slate-grey text-white" }
      : project.isActive
      ? { label: "Active", color: "bg-emerald-green text-white" }
      : { label: "Inactive", color: "bg-slate-grey text-white opacity-50" };

    return {
      progressPercentage: progress,
      formattedGoal: goal,
      formattedDonated: donated,
      status: projectStatus,
    };
  }, [project.goal, project.totalDonated, project.donationToken, project.isCompleted, project.isActive]);

  return (
    <Link href={`/project/${project.id}`}>
      <Card variant="outlined" className="h-full transition-all hover:shadow-lg">
        <CardBody>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-grey mb-1">
                Project #{project.id.toString()}
              </h3>
              <p className="text-sm text-slate-grey opacity-70">
                NGO: {formatAddress(project.ngo)}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
            >
              {status.label}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-grey opacity-70">Goal:</span>
                <span className="font-medium text-slate-grey">{formattedGoal}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-grey opacity-70">Donated:</span>
                <span className="font-medium text-slate-grey">{formattedDonated}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-grey opacity-70">Progress</span>
                <span className="font-medium text-slate-grey">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-green h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(parseFloat(progressPercentage), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="pt-0 flex gap-2">
          <Link
            href={`/project/${project.id}`}
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="secondary" size="sm" fullWidth>
              View Details
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDonateClick}
            className="flex-1"
          >
            Donate
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
});

