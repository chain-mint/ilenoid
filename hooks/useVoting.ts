"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ILENOID_CONTRACT_INTERFACE } from "@/lib/contract";
import { callReadOnlyFunction, callContractFunction, ClarityValues } from "@/lib/stacks-contract";
import { getStxAddress } from "@/lib/stacks-connect";
import toast from "react-hot-toast";

/**
 * Hook to check if a donor has voted on a milestone
 */
export function useHasVoted(
  projectId: number | bigint,
  milestoneId: number | bigint
): {
  hasVoted: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const senderAddress = getStxAddress();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["hasVoted", projectId, milestoneId, senderAddress],
    queryFn: async () => {
      if (!senderAddress) return false;

      const result = await callReadOnlyFunction(
        ILENOID_CONTRACT_INTERFACE.readOnly.hasDonorVoted,
        [
          ClarityValues.uint(Number(projectId)),
          ClarityValues.uint(Number(milestoneId)),
          ClarityValues.principal(senderAddress),
        ],
        senderAddress
      );

      return result.value || result || false;
    },
    enabled: projectId > 0 && milestoneId >= 0 && !!senderAddress,
  });

  return {
    hasVoted: data || false,
    isLoading,
    isError,
    error: error as Error | null,
  };
}

/**
 * Hook to vote on a milestone
 */
export function useVoteOnMilestone(
  projectId: number | bigint,
  milestoneId: number | bigint
): {
  vote: (approve: boolean) => Promise<void>;
  txId: string | undefined;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
} {
  const queryClient = useQueryClient();

  const {
    mutate: vote,
    data: txId,
    isPending,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: async (approve: boolean) => {
      const txId = await callContractFunction(
        ILENOID_CONTRACT_INTERFACE.public.voteOnMilestone,
        [
          ClarityValues.uint(Number(projectId)),
          ClarityValues.uint(Number(milestoneId)),
          ClarityValues.bool(approve),
        ]
      );

      return txId;
    },
    onSuccess: (txId) => {
      toast.success(`Vote submitted! TX: ${txId.substring(0, 8)}...`);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["hasVoted", projectId, milestoneId] });
      queryClient.invalidateQueries({ queryKey: ["projectMilestones", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: (error: Error) => {
      toast.error(`Vote failed: ${error.message}`);
    },
  });

  return {
    vote: (approve: boolean) => vote(approve),
    txId,
    isPending,
    isSuccess,
    error: error as Error | null,
  };
}
