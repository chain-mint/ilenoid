import { useReadContract, useReadContracts } from "wagmi";
import { CHARITY_TRACKER_ADDRESS, CHARITY_TRACKER_ABI } from "@/lib/contract";
import { type Project, type Milestone } from "@/types/contract";
import { type Address } from "viem";

/**
 * Type guard to check if data is a tuple/array
 */
function isTuple(data: unknown): data is unknown[] {
  return Array.isArray(data);
}

/**
 * Safely transform contract project data to Project type
 */
function transformProjectData(
  data: unknown,
  projectId?: bigint
): Project | null {
  if (!isTuple(data) || data.length < 9) {
    return null;
  }

  return {
    id: projectId ?? (data[0] as bigint),
    ngo: data[1] as Address,
    donationToken: data[2] as Address,
    goal: data[3] as bigint,
    totalDonated: data[4] as bigint,
    balance: data[5] as bigint,
    currentMilestone: data[6] as bigint,
    isActive: data[7] as boolean,
    isCompleted: data[8] as boolean,
  };
}

/**
 * Safely transform contract milestone data to Milestone type
 */
function transformMilestoneData(data: unknown): Milestone | null {
  if (!isTuple(data) || data.length < 5) {
    return null;
  }

  return {
    description: data[0] as string,
    amountRequested: data[1] as bigint,
    approved: data[2] as boolean,
    fundsReleased: data[3] as boolean,
    voteWeight: data[4] as bigint,
  };
}

/**
 * Hook to fetch a single project by ID
 * @param projectId - The project ID to fetch
 * @returns Project data, loading state, error state, and refetch function
 */
export function useProject(projectId: number | bigint): {
  project: Project | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useReadContract({
    address: CHARITY_TRACKER_ADDRESS,
    abi: CHARITY_TRACKER_ABI,
    functionName: "getProject",
    args: [BigInt(projectId)],
    query: {
      enabled: projectId > 0,
    },
  });

  // Transform the contract response to Project type
  const project: Project | undefined = data
    ? transformProjectData(data) ?? undefined
    : undefined;

  return {
    project,
    isLoading,
    isError,
    error,
    refetch,
  };
}

/**
 * Hook to fetch all projects
 * @returns All projects, loading state, and error state
 */
export function useAllProjects(): {
  projects: Project[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  // First, get the project counter
  const { data: projectCounter, isLoading: isLoadingCounter } =
    useReadContract({
      address: CHARITY_TRACKER_ADDRESS,
      abi: CHARITY_TRACKER_ABI,
      functionName: "projectCounter",
    });

  // Create array of project IDs (1 to projectCounter)
  const counter = projectCounter as bigint | undefined;
  const projectIds =
    counter && counter > BigInt(0)
      ? Array.from({ length: Number(counter) }, (_, i) => i + 1)
      : [];

  // Batch fetch all projects
  const contracts = projectIds.map((id) => ({
    address: CHARITY_TRACKER_ADDRESS,
    abi: CHARITY_TRACKER_ABI,
    functionName: "getProject" as const,
    args: [BigInt(id)] as const,
  }));

  const { data, isLoading, isError, error } = useReadContracts({
    contracts,
    query: {
      enabled: projectIds.length > 0,
    },
  });

  // Transform the results
  const projects: Project[] =
    data
      ?.map((result, index) => {
        if (result.status === "failure" || !result.result) {
          return null;
        }
        return transformProjectData(result.result, BigInt(projectIds[index]));
      })
      .filter((p): p is Project => p !== null && p.id > BigInt(0)) || [];

  return {
    projects,
    isLoading: isLoading || isLoadingCounter,
    isError,
    error,
  };
}

/**
 * Hook to fetch all milestones for a project
 * @param projectId - The project ID
 * @returns All milestones for the project, loading state, and error state
 */
export function useProjectMilestones(projectId: number | bigint): {
  milestones: Milestone[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  // First, get the milestone count
  const { data: milestoneCount, isLoading: isLoadingCount } =
    useReadContract({
      address: CHARITY_TRACKER_ADDRESS,
      abi: CHARITY_TRACKER_ABI,
      functionName: "getProjectMilestoneCount",
      args: [BigInt(projectId)],
      query: {
        enabled: projectId > 0,
      },
    });

  // Create array of milestone IDs (0-indexed: 0, 1, 2, ...)
  const count = milestoneCount as bigint | undefined;
  const milestoneIds =
    count && count > BigInt(0)
      ? Array.from({ length: Number(count) }, (_, i) => i)
      : [];

  // Batch fetch all milestones
  const contracts = milestoneIds.map((milestoneId) => ({
    address: CHARITY_TRACKER_ADDRESS,
    abi: CHARITY_TRACKER_ABI,
    functionName: "getMilestone" as const,
    args: [BigInt(projectId), BigInt(milestoneId)] as const,
  }));

  const { data, isLoading, isError, error } = useReadContracts({
    contracts,
    query: {
      enabled: milestoneIds.length > 0,
    },
  });

  // Transform the results
  const milestones: Milestone[] =
    data
      ?.map((result) => {
        if (result.status === "failure" || !result.result) {
          return null;
        }
        return transformMilestoneData(result.result);
      })
      .filter((m): m is Milestone => m !== null) || [];

  return {
    milestones,
    isLoading: isLoading || isLoadingCount,
    isError,
    error,
  };
}

/**
 * Hook to fetch the current milestone for a project
 * @param projectId - The project ID
 * @returns Current milestone, loading state, and error state
 */
export function useCurrentMilestone(projectId: number | bigint): {
  milestone: Milestone | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const { data, isLoading, isError, error } = useReadContract({
    address: CHARITY_TRACKER_ADDRESS,
    abi: CHARITY_TRACKER_ABI,
    functionName: "getCurrentMilestone",
    args: [BigInt(projectId)],
    query: {
      enabled: projectId > 0,
    },
  });

  // Transform the contract response to Milestone type
  const milestone: Milestone | undefined = data
    ? transformMilestoneData(data) ?? undefined
    : undefined;

  return {
    milestone,
    isLoading,
    isError,
    error,
  };
}

