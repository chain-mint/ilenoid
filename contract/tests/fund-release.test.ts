import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
import {
  getAccounts,
  registerNGO,
  createProject,
  donateSTX,
  voteOnMilestone,
  releaseFunds,
  getMilestone,
  getProject,
} from "./helpers";

describe("Fund Release", () => {
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

    // Donate and vote to meet quorum
    donateSTX(projectId, 400000, accounts.wallet2);
    donateSTX(projectId, 200000, accounts.wallet3);
    voteOnMilestone(projectId, accounts.wallet2);
    voteOnMilestone(projectId, accounts.wallet3);
  });

  it("should allow NGO to release funds when quorum is met", () => {
    const result = releaseFunds(projectId, accounts.wallet1);
    expect(result.result).toBeOk(Cl.uint(500000));

    const milestone = getMilestone(projectId, 0);
    if (milestone.result.type === "some") {
      const milestoneData = (milestone.result.value as any).data || milestone.result.value;
      expect(milestoneData.approved).toBeBool(true);
      expect(milestoneData["funds-released"]).toBeBool(true);
    }

    const project = getProject(projectId);
    if (project.result.type === "some") {
      const projectData = (project.result.value as any).data || project.result.value;
      expect(projectData.balance).toBeUint(100000); // 600000 - 500000
      expect(projectData["current-milestone"]).toBeUint(1);
    }
  });

  it("should not allow non-NGO to release funds", () => {
    const result = releaseFunds(projectId, accounts.wallet2);
    expect(result.result).toBeErr(Cl.uint(50)); // ERR_NOT_PROJECT_NGO
  });

  it("should reject release when quorum not met", () => {
    // Create new project with insufficient votes
    registerNGO(accounts.wallet2, "deployer");
    createProject(
      accounts.wallet2,
      1000000,
      ["Milestone 1"],
      [1000000],
      null
    );
    const newProjectId = 2;

    donateSTX(newProjectId, 100000, accounts.wallet3);
    voteOnMilestone(newProjectId, accounts.wallet3);

    const result = releaseFunds(newProjectId, accounts.wallet2);
    expect(result.result).toBeErr(Cl.uint(54)); // ERR_QUORUM_NOT_MET
  });

  it("should mark project as completed on final milestone", () => {
    // Release first milestone
    releaseFunds(projectId, accounts.wallet1);

    // Donate and vote for second milestone
    donateSTX(projectId, 100000, accounts.wallet2);
    voteOnMilestone(projectId, accounts.wallet2);

    // Release second milestone (final)
    const result = releaseFunds(projectId, accounts.wallet1);
    expect(result.result).toBeOk(Cl.uint(500000));

    const project = getProject(projectId);
    if (project.result.type === "some") {
      const projectData = (project.result.value as any).data || project.result.value;
      expect(projectData["is-completed"] || (projectData as any).isCompleted).toBeBool(true);
      expect(projectData["is-active"] || (projectData as any).isActive).toBeBool(false);
    }
  });
});
