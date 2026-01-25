import { useQuery } from "@tanstack/react-query";
import { Cl } from "@stacks/transactions";
import { ILENOID_CONTRACT_INTERFACE } from "@/lib/contract";
import { callReadOnlyFunction, transformProjectData, transformMilestoneData } from "@/lib/stacks-contract";
import { getStxAddress } from "@/lib/stacks-connect";
import { type Project, type Milestone } from "@/types/contract";

/**
 * Hook to fetch a single project by ID
 */
export function useProject(projectId: number | bigint): {
  project: Project | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const senderAddress = getStxAddress();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId || projectId <= 0) return null;
      
      const result = await callReadOnlyFunction(
        ILENOID_CONTRACT_INTERFACE.readOnly.getProject,
        [Cl.uint(BigInt(projectId))],
        senderAddress || undefined
      );
      
      return transformProjectData(result, Number(projectId));
    },
    enabled: projectId > 0 && !!senderAddress,
  });

  return {
    project: data || undefined,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
}

/**
 * Hook to fetch all projects
 */
export function useAllProjects(): {
  projects: Project[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const senderAddress = getStxAddress();

  // First, get the project counter
  const { data: projectCounter, isLoading: isLoadingCounter } = useQuery({
    queryKey: ["projectCounter"],
    queryFn: async () => {
      const result = await callReadOnlyFunction(
        ILENOID_CONTRACT_INTERFACE.readOnly.getProjectCounter,
        [],
        senderAddress || undefined
      );
      return Number(result.value || result || 0);
    },
    enabled: !!senderAddress,
  });

  // Fetch all projects
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allProjects", projectCounter],
    queryFn: async () => {
      if (!projectCounter || projectCounter === 0) return [];

      const projectIds = Array.from({ length: projectCounter }, (_, i) => i + 1);
      const projects = await Promise.all(
        projectIds.map(async (id) => {
          try {
            const result = await callReadOnlyFunction(
              ILENOID_CONTRACT_INTERFACE.readOnly.getProject,
              [Cl.uint(id)],
              senderAddress || undefined
            );
            return transformProjectData(result, id);
          } catch (error) {
            console.error(`Error fetching project ${id}:`, error);
            return null;
          }
        })
      );

      return projects.filter((p): p is Project => p !== null && p.id > BigInt(0));
    },
    enabled: !!projectCounter && projectCounter > 0 && !!senderAddress,
  });

  return {
    projects: data || [],
    isLoading: isLoading || isLoadingCounter,
    isError,
    error: error as Error | null,
  };
}

/**
 * Hook to fetch all milestones for a project
 */
export function useProjectMilestones(projectId: number | bigint): {
  milestones: Milestone[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const senderAddress = getStxAddress();

  // Get project to find milestone count
  const { data: project, isLoading: isLoadingProject } = useProject(projectId);

  // Fetch all milestones
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projectMilestones", projectId, project?.milestoneCount],
    queryFn: async () => {
      if (!project || !project.milestoneCount) return [];

      const milestoneIds = Array.from({ length: project.milestoneCount }, (_, i) => i);
      const milestones = await Promise.all(
        milestoneIds.map(async (milestoneId) => {
          try {
            const result = await callReadOnlyFunction(
              ILENOID_CONTRACT_INTERFACE.readOnly.getMilestone,
              [
                Cl.tuple({
                  "project-id": Cl.uint(Number(projectId)),
                  "milestone-id": Cl.uint(milestoneId),
                }),
              ],
              senderAddress || undefined
            );
            return transformMilestoneData(result);
          } catch (error) {
            console.error(`Error fetching milestone ${milestoneId}:`, error);
            return null;
          }
        })
      );

      return milestones.filter((m): m is Milestone => m !== null);
    },
    enabled: !!project && project.milestoneCount > 0 && !!senderAddress,
  });

  return {
    milestones: data || [],
    isLoading: isLoading || isLoadingProject,
    isError,
    error: error as Error | null,
  };
}

