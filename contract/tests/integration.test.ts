import { describe, it, expect, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";
import {
  getAccounts,
  registerNGO,
  isVerifiedNGO,
  createProject,
  donateSTX,
  getProject,
  voteOnMilestone,
  getMilestone,
  releaseFunds,
} from "./helpers";

describe("Integration: Full Project Lifecycle", () => {
  let accounts: ReturnType<typeof getAccounts>;

  beforeEach(() => {
    accounts = getAccounts();
  });

  it("should complete full project lifecycle", () => {
    // 1. Register NGO
    registerNGO(accounts.wallet1, "deployer");
    expect(isVerifiedNGO(accounts.wallet1).result).toBeBool(true);

    // 2. Create project
    const createResult = createProject(
      accounts.wallet1,
      1000000,
      ["Milestone 1", "Milestone 2"],
      [500000, 500000],
      null
    );
    expect(createResult.result).toBeOk(Cl.uint(1));
    const projectId = 1;

    // 3. Multiple donations
    donateSTX(projectId, 200000, accounts.wallet2);
    donateSTX(projectId, 300000, accounts.wallet3);
    donateSTX(projectId, 100000, accounts.wallet4);

    const project = getProject(projectId);
    if (project.result.type === "some") {
      const projectData = (project.result.value as any).data || project.result.value;
      expect(projectData["total-donated"]).toBeUint(600000);
      expect(projectData.balance).toBeUint(600000);
    }

    // 4. Voting
    voteOnMilestone(projectId, accounts.wallet2);
    voteOnMilestone(projectId, accounts.wallet3);
    voteOnMilestone(projectId, accounts.wallet4);

    const milestone = getMilestone(projectId, 0);
    if (milestone.result.type === "some") {
      const milestoneData = (milestone.result.value as any).data || milestone.result.value;
      expect(milestoneData["vote-weight"]).toBeUint(600000);
    }

    // 5. Release funds
    const releaseResult = releaseFunds(projectId, accounts.wallet1);
    expect(releaseResult.result).toBeOk(Cl.uint(500000));

    // 6. Verify milestone advanced
    const projectAfter = getProject(projectId);
    if (projectAfter.result.type === "some") {
      const projectData = (projectAfter.result.value as any).data || projectAfter.result.value;
      expect(projectData["current-milestone"]).toBeUint(1);
      expect(projectData.balance).toBeUint(100000);
    }
  });
});
