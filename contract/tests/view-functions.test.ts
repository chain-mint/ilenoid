import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
import {
  getAccounts,
  registerNGO,
  createProject,
  donateSTX,
  voteOnMilestone,
  getProject,
  getMilestone,
  getDonorContribution,
  getMilestoneVoteStatus,
} from "./helpers";

describe("View Functions", () => {
  let accounts: ReturnType<typeof getAccounts>;
  let projectId: number;

  beforeEach(() => {
    accounts = getAccounts();
    registerNGO(accounts.wallet1, "deployer");
    createProject(
      accounts.wallet1,
      1000000,
      ["Milestone 1", "Milestone 2"],
      [500000, 500000],
      null
    );
    projectId = 1;
  });

  it("should return project information", () => {
    const project = getProject(projectId);
    expect(project.result.type).toBe("some"); // some
    if (project.result.type === "some") {
      const projectData = (project.result.value as any).data || project.result.value;
      expect(projectData.id).toBeUint(1);
      expect(projectData.ngo).toBePrincipal(accounts.wallet1);
    }
  });

  it("should return milestone information", () => {
    const milestone = getMilestone(projectId, 0);
    expect(milestone.result.type).toBe("some"); // some
    if (milestone.result.type === "some") {
      const milestoneData = (milestone.result.value as any).data || milestone.result.value;
      expect(milestoneData["amount-requested"] || (milestoneData as any)["amount-requested"]).toBeUint(500000);
    }
  });

  it("should return donor contribution", () => {
    donateSTX(projectId, 100000, accounts.wallet2);
    
    const contribution = getDonorContribution(projectId, accounts.wallet2);
    expect(contribution.result).toBeUint(100000);
  });

  it("should return milestone vote status", () => {
    donateSTX(projectId, 400000, accounts.wallet2);
    voteOnMilestone(projectId, accounts.wallet2);

    const status = getMilestoneVoteStatus(projectId, 0);
    expect(status.result.type).toBe("some"); // some
    if (status.result.type === "some" && status.result.value.type === "ok") {
      const voteStatus = (status.result.value as any).value || status.result.value;
      expect(voteStatus["vote-weight"]).toBeUint(400000);
      expect(voteStatus["can-release"]).toBeBool(true);
    }
  });
});
